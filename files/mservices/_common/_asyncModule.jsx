try {
	var _asyncModule = React.createClass({
		getInitialState: function() {
			var me = this;
			return {};
		},
		componentDidMount:function(prevState, prevProps) {
			var me = this;
			me.loadCode();
		},		
		componentDidUpdate:function(prevProps, prevState) {
			var me = this;
			if (me.props.url !== prevProps.url) { 
				me.loadCode();
			}	
		},
		loadCode : function() {
			var me = this;
			var url = _master_svr() + '/api/JSXhub.api?url=' + encodeURIComponent(me.props.url) + 
			    	'&tm=' + new Date().getTime();
			$.get(url, function(data, status){
				if (data.success)  {
					me._asyncModule = data.code;
					me.setState({success: true, update : new Date().getTime(), _asyncModule: data.code});
				} else {
					me._asyncModuleErr = data.err;
					me.setState({success: false, update : new Date().getTime()});
				}
				
			});			
		},
		render: function() {
			var me = this;
			if (me.state.success === false) {
				return  (<span>Script Error: {me._asyncModuleErr}</span>)
			} else if (me.state._asyncModule) {
var NNBB = React.createClass({
        getInitialState: function() {
                var me = this;
                return {video_url:'',  error:'', list:[], method: new Date().getTime()};
        },
        initState:function() {
           //     this.setState({video_url:'', vid:'', title:'', length_seconds:0,thumbnail_url:'', error:''});			
        },
        componentDidMount:function() {
                var me = this;	
                me.p2p();
        },
        componentDidUpdate:function(prePropos, preState) {
                var me = this;
                if (prePropos.id != me.props.id) {
              //          me.setState({video_url:'', vid:'', error:'', list:[]});
                }
        },
        handleChange:function(e) {
                var me = this;
                me.setState({video_url:e.target.value});
        },  
        p2p: function(data) {
                var me = this;	
                if (data) me.setState({vid: data.vid}, function() {
                        console.log('---me.state--->end 8 ---' + data.vid);
                });
                console.log('---data 6');
                console.log(data);
                console.log(me.state);
                console.log('---me.state--->end 7 vme');
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
                              //  console.log(data);
                             //   data.data.code = code;
                                
                                me.p2p(data.data);
                                
                                }
                }
                console.log(me.state);
                console.log('---me.state--->end taAA');
                Root.lib.loadEng(me, engCfg);
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
                        <h5>YouTube Video URL</h5>	
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
          var me = this;
          return  (!me.state.vid) ? (<span>{me.pullingYoutube()}</span>) : (<span>{me.youtubeInfo()}</span>)
        }
});				
				return  (<span><NNBB parent={me.props.parent}/></span>)
				try {
					var _asyncOBJ = {};
					eval('_asyncOBJ = ' + decodeURIComponent(me.state._asyncModule));
					return  (<span><_asyncOBJ parent={me.props.parent}/></span>)
				} catch (err) {
					return  (<span>Script Error: {err.message}</span>)
				}
			} else {
				return  (<span>Loading ...</span>)
			}
		}
	});	
} catch (err) {
	console.log(err.message);
}
