React.createClass({
        getInitialState: function() {
          var me = this;
          return {}
        },
        goBackMyVideos: function() {
                window.location.href = '#/tutor/my_videos';
        },
        init : function() {
                var DropBox = function(_setting) {

                    this.holder = _setting.holder;
                    this.basket = _setting.basket;

                    this.fileBuffer = null;

                    this.tests = {
                      filereader: typeof FileReader != 'undefined',
                      dnd: 'draggable' in document.createElement('span'),
                      formdata: !!window.FormData,
                      progress: "upload" in new XMLHttpRequest
                    };
                    this.support = {
                      filereader: document.getElementById('filereader'),
                      formdata: document.getElementById('formdata'),
                      progress: document.getElementById('progress')
                    };
                    this.acceptedTypes = ['image/png','image/jpeg','video/mp4'];

                    this.previewfiles = function(files) {
                         var me = this;
                        var formData = me.tests.formdata ? new FormData() : null;
                        for (var i = 0; i < files.length; i++) {
                          if (me.tests.formdata) formData.append('file', files[i]);
                          me.previewfile(files[i]);
                        }       
                    }     
                    this.previewfile = function(file) {
                        var me = this;
                      if (me.tests.filereader === true && me.acceptedTypes.indexOf(file.type) !== -1) {
                        var reader = new FileReader();
                        reader.onload = function (event) {
                              var image = new Image();
                              image.src = event.target.result;
                              image.width = 250; // a fake resize
                              me.basket.appendChild(image);
                            };

                        reader.readAsDataURL(file);
                      }  else {
                        me.basket.innerHTML += '<p>Uploaded ' + file.name + ' ' + (file.size ? (file.size/1024|0) + 'K' : '');
                        console.log(file);
                      }
                    }    
                    this.init = function () {
                          var me  = this;
                          me.holder.ondragover = function () { 
                            this.className = 'hover'; return false; 
                          };
                          me.holder.ondragend = function () { 
                            this.className = ''; return false; 
                          };
                          me.holder.ondrop = function (e) {
                            this.className = '';
                            e.preventDefault();
                              fileBuffer = e.dataTransfer.files;
                              me.previewfiles(e.dataTransfer.files);
                              me.fileBuffer = e.dataTransfer.files;
                              if (_setting.submitTrigger === 'auto') {
                                   if (me.fileBuffer)  me.uploadFiles(me.fileBuffer);
                              }

                          } 
                          if (typeof _setting.submitTrigger === 'object') {
                              $(_setting.submitTrigger).on( 'click', function(event) {
                                    if (me.fileBuffer) me.uploadFiles(me.fileBuffer);
                               })
                          }
                    }
                    this.uploadFiles = function  (files) {
                      //  debugger;
                            var up = [];
                             for (var i = 0; i < files.length; i++) {
                                up[i] = new FILEUPLOAD(
                                    {
                                        file: files[i],
                                        sliceSize : (_setting.sliceSize) ? _setting.sliceSize : 1024 * 16,
                                        threads : (_setting.threads) ? _setting.threads : 5,
                                        progress : function(M, sourceFn, percent_done) {
                                             _setting.progress(M, sourceFn, percent_done);
                                        },
                                        done : function(M, sourceFn, data) {
                                             _setting.done(M, sourceFn, data);
                                        },
                                        error : function() {
                                             if (_setting.error) _setting.error();
                                        }

                                    }
                                  )
                                 up[i].upload();
                             }
                    }    
                }                
                var FILEUPLOAD = function(_setting) {
                        this.slice_size = (_setting.sliceSize) ? _setting.sliceSize : (1024 * 16);
                        this.ses = null;
                        this.holded = {}; 
                        this.file = {};
                        this.inProcess = {};
                        this.upload_M = {};
                        var size_done = 0;
                        this.getPos = function() {
                            var me = this;
                            for(var k in me.upload_M) {
                                if (['','D'].indexOf(me.upload_M[k]) === -1) {
                                    if (new Date().getTime() - parseInt(me.upload_M[k]) > 6000) {
                                        me.holded[k] = (!me.holded[k]) ? 1 : me.holded[k] + 1;
                                        if (me.holded[k] > 2) {
                                            clearInterval(me._ITV);
                                            (_setting.error) ? _setting.error() : '';
                                            return false;
                                        }
                                        me.upload_M[k] = '';
                                    }
                                }                
                            }
                            for(var k in me.upload_M) {

                               if (Object.keys(me.inProcess).length > (me.threads - 1)) {
                                    return false;
                               } else if (me.upload_M[k] === '') {
                                    me.inProcess[k] = true;
                                    return parseInt(k);
                                }                
                            }  
                            clearInterval(me._ITV);
                            me.ajaxFinished();
                            return 'finished'
                        }

                       this.upload_file = function() {
                           var me = this;
                           return function() {
                                var pos = me.getPos();
                                if (pos === false || pos === 'finished')  return true;     
                                me.upload_M[pos] = new Date().getTime();
                                var blob = me.file.slice( pos, pos + me.slice_size);
                                var size_done = pos + me.slice_size - 1; 
                                var percent_done = Math.min(Math.floor( ( size_done / me.file.size ) * 100 ), 100);
                                (_setting.progress) ? _setting.progress(me.upload_M, me.file.name, percent_done) : '';

                                me.reader.onloadend = function( event ) {
                                    var d = event.target.result.split( ';base64,');
                                    if ( event.target.readyState === FileReader.DONE ) { 
                                        me.ajaxUpload(pos, d[1]);
                                    }
                                };        
                                me.reader.readAsDataURL( blob );
                           }
                        }

                       this.ajaxUpload = function(pos, dt) {
                           var me = this;
                           $.ajax({
                              type: "POST",
                              url: _setting.UploadServer,
                              data: {pos:pos, data:dt, ses: me.ses},
                              success: function(data) {
                                    if (!me.ses) me.ses = data.ses;
                                    if (data.status === 'success') {
                                        delete me.inProcess[pos];
                                        me.upload_M[pos] = 'D';
                                     }
                              },
                              dataType: 'JSON'
                            }); 
                        }  
                       this.init = function(cbk) {
                           var me = this;
                           $.ajax({
                              type: "POST",
                              url: _setting.UploadServer,
                              data: {},
                              success: function(data) {
                                  if (!me.ses) me.ses = data.ses;
                                  cbk();
                              },
                              dataType: 'JSON'
                            }); 
                        }  
                        this.ajaxFinished = function () {
                            var me = this;

                            $.ajax({
                              type: "POST",
                              url: _setting.UploadServer,
                              data: {pos:'finished', ses: me.ses},
                              success: function(data) {
                                  (_setting.done) ? _setting.done(me.upload_M, me.file.name, data) : '';
                              },
                              dataType: 'JSON'
                            }); 
                        }  
                        this.upload = function() {
                            var me = this;
                            me.threads = (_setting.threads) ? _setting.threads : 1;
                            me.reader = new FileReader();
                            me.file = _setting.file;
                            for (var i=0; i < me.file.size; i+= me.slice_size) {
                                me.upload_M[i] = '';
                            }
                            me.init(
                                function() {
                                     me._ITV = setInterval(me.upload_file(), 20);
                                });
                        }        
                    }
               
           //     var me = this;
          //      me.props.parent.goBackMyVideos();
             var uploadResult = {};
             function showResult() {
                  str = '';
                  for(k in uploadResult) {
                       if (uploadResult[k].src) {
                            str += k + ':<img src="' + uploadResult[k].src + '" width="300" /><br/>';
                       } else {
                            str += k + ' Completed: ' + uploadResult[k].perc + '%<br>';
                       }
                  }
                  $('#upload_result' ).html(str);
             }   
             function showMatrix(v) {
                  str = '';
                  for(k in v) {
                       if (v[k] === 'D') {
                            str += '*';
                       } else if  (v[k] === '') { 
                            str += '';
                       }else {
                            str += '.';
                       }
                  }
                  $('#upload_mitrix' ).html(str);
             }        

             $('#dbi-file-upload-submit').on( 'click', function(event) {
                 event.preventDefault();
                  uploadResult = {}
                 var files = $('#dbi-file-upload' )[0].files; 
                 up = [];
                 for (var i = 0; i < files.length; i++) {
                    up[i] = new FILEUPLOAD(
                        {
                            file: files[i],
                            sliceSize : 1024 * 16,
                            threads : 5,
                            progress : function(M, sourceFn, percent_done) {
                                 if (!uploadResult[sourceFn]) uploadResult[sourceFn] = {};
                                 uploadResult[sourceFn]['perc'] = percent_done;
                                 showResult();
                                 showMatrix(M);
                                 //console.log(me.upload_M);
                            },
                            done : function(M, sourceFn, data) {
                                 $("#dbi-file-upload").val('');
                                 if (!uploadResult[sourceFn]) uploadResult[sourceFn] = {};
                                 uploadResult[sourceFn].src = '/api/sendup.api?fn=' + data.fn + '&nocache=' + new Date().getTime();
                                 showResult();
                                 showMatrix(M);
                            },
                            error : function() {
                                 $('#upload_result' ).html('Upload failure!!!');
                            }
                        }
                      )
                     up[i].upload();
                 }
             });
                     
             // =================   
                
        },
        render: function() {
          var me = this;
          return  (<span>
                         File Upload &nbsp;
                         <button className="btn btn-success" onClick={me. goBackMyVideos.bind(me)}>
                                 Go Back
                         </button>
                          <hr/>
                        <form>
                           <p id="dbi-upload-progress">Please select a file and click "Upload" to continue.</p>
                           <input id="dbi-file-upload" type="file" name="dbi_import_file" multiple /><br><br>
                           <input id="dbi-file-upload-submit" class="button button-primary" type="button" value="Upload" />

                        </form>
                        <br/><hr/><br/>
                        <div id = "upload_result"></div>
                        <div id = "upload_mitrix"></div>                          
                 </span>)
        }
});
