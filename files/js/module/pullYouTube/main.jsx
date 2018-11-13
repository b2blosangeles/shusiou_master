React.createClass({
        getInitialState: function() {
                var me = this;
                return {video_url:'',  videof: '', error:'', list:[], method: new Date().getTime()};
        },
        componentDidUpdate:function(prePropos, preState) {
                var me = this;
                console.log('===parent changed ====');
                console.log('----me.state--->');
                console.log(me.state);
                if (prePropos.id != me.props.id) {
              //          me.setState({video_url:'', vid:'', error:'', list:[]});
                }
        },
        handleChange:function(e) {
                var me = this;
                me.setState({video_url:e.target.value});
        },
        niuniu : function(o) {
                var me = this;
                alert(777);
                me.setState({videof:'e.target.value'});
                
        },
        videoUrlDecode:function() {
                var me = this, code = me.state.video_url;		
                let engCfg = {
                        request:{code:'getVieoInfo', 
                                 url :  _master_svr() + '/api/video/myVideo.api?opt=getYouTubeInfo', 
                                 method:'post', 
                                 data:{video_url: me.state.video_url}
                        },
                        hold:500,
                        setting: {timeout:6000},
                        callBack: function(data) {
                                console.log(data.data);
                                alert(9992);
                             //   data.data.code = code;
                               target.niuniu();
                                console.log(data);
                                console.log('called niuniu ta HHH');
                               // me.props.parent.setState({vid: data.data.vid}, function() { 
                                 //   console.log('--==me.state--->end 666 --->' + me.props.parent.state.vid);
                               // });        
                          }
                }
                
               Root.lib.loadEng(me, engCfg);
		return true;
             //   me.props.parent.dataEngine(engCfg, me);
			var url = _master_svr() + '/api/JSXhub.api?url=' + encodeURIComponent(me.props.url) + 
			    	'&tm=' + new Date().getTime();
			$.ajax({
			      type: 'POST',
			      url:  _master_svr() + '/api/video/myVideo.api?opt=getYouTubeInfo',
			      data: {video_url: me.state.video_url},
			      dataType: 'JSON',
			      success: function(resultData) { 
				      console.log(resultData);
				      me.niuniu(); 
			      }
			})	
		
		/*
			$.get(url, function(data, status){
				me.niuniu();
				
			});                
                */
                
                /*
                setTimeout(
                        function() {
                                 me.niuniu();
                                console.log('called niuniu');
                        }, 3000
                );
                */
        },
        videoUrlValidation:function(){
                var p = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
                return (this.state.video_url.match(p))?true:false;
        },		
        videoUrlSubmitable:function(){
                return (this.videoUrlValidation())?'input-group-addon btn btn-warning':'input-group-addon btn btn-warning disabled';
        }, 
        pullingYoutube : function () {
                var me = this;
                return (<p  style={{'padding':'1em'}}>				
                        <h5>YouTube Video URL ===> {me.props.parent.state.vid}===</h5>	
                        <div className="input-group">
                          <input type="text" className="form-control" placeholder="Input YouTube link" 
                                  value={me.state.video_url}
                                  onChange={this.handleChange.bind(this)}
                                  aria-describedby="basic-addon2"/>
                          <div className={me.videoUrlSubmitable()} onClick={me.videoUrlDecode.bind(me)}>Submit</div>
                        </div>
                </p>)
        },
        youtubeInfo : function () {
                var me = this;
                return (<p  style={{'padding':'1em'}}>				
                        <h5>YouTube Video INFO</h5>	
                </p>)
        },       
        render: function() {
          var me = this, parent = me.props.parent;
          return  (!parent.state.vid) ? (<span>{me.pullingYoutube()}</span>) : (<span>{me.youtubeInfo()}</span>)
        }
});
