React.createClass({
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
        /*
        p2p: function(data) {
                var me = this;	
                if (data) {
                        me.props.parent.setState({vid: data.vid}, function() { 
                        console.log('---me.state--->end 8kk --->' + me.props.parent.state.vid);
                        });
                }
              //  console.log('---data 6');
               // console.log(data);
               // console.log(me.state);
              //  console.log('---me.state--->end 7 xxx vme');
        },
        */
        
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
                             //   data.data.code = code;
                                me.props.parent.setState({vid: data.dat.vid}, function() { 
                                    console.log('---me.state--->end 8kk --->' + me.props.parent.state.vid);
                                });
                             //   me.p2p(data.data);
                                
                          }
                }
                console.log(me.state);
                console.log('---me.state--->end taXXXXX');
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
          return  (!parent.state.vid) ? (<span>{me.pullingYoutube()}</span>) : (<span>{me.youtubeInfo()}</span>)
        }
});
