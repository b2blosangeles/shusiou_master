React.createClass({
        getInitialState: function() {
                var me = this;
                return {video_url:'',  videof: '', error:'', list:[], method: new Date().getTime()};
        },
        componentDidUpdate:function(prePropos, preState) {
                var me = this;
                console.log('===parent changed ====');
                console.log(me.state);
                if (prePropos.id != me.props.id) {
              //          me.setState({video_url:'', vid:'', error:'', list:[]});
                }
        },
        handleChange:function(e) {
                var me = this;
                me.setState({video_url:e.target.value});
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
                               me.setState({vid: data.data.vid});
                                console.log(data);
                                console.log('called niuniu taGGG');
                               // me.props.parent.setState({vid: data.data.vid}, function() { 
                                 //   console.log('--==me.state--->end 666 --->' + me.props.parent.state.vid);
                               // });        
                          }
                }
                
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
		return (<span>				
				{(!parent.state.vid) ? me.pullingYoutube() : me.youtubeInfo()}
				{Root.lib.landingModal(me)}
                	</span>)
        }
});
