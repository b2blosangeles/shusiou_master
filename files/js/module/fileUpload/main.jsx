React.createClass({
        getInitialState: function() {
          var me = this;
          return {}
        },
        pp: function() {
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
                
                
                
                var me = this;
                me.props.parent.goBackMyVideos();
        },
        render: function() {
          var me = this;
          return  (<span>
                         File Upload <a onClick={me.pp.bind(me)} >Go Back</a>
                 </span>)
        }
});
