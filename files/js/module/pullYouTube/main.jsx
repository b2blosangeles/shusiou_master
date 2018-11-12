React.createClass({
        getInitialState: function() {
          var me = this;
          return {}
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
                                data.data.code = code;
                                me.setState(data.data);
                        }
                }			
                Root.lib.loadEng(me, engCfg);
        },        
        pullingYoutube : function () {
                var me = this;
                return (<p  style={{'padding':'1em'}}>				
                        <h5>Pulling YouTube Video --- Upload video</h5>	
                        <div className="input-group">
                          <input type="text" className="form-control" placeholder="Input YouTube link" 
                                  value={me.state.video_url}
                                  onChange={this.handleChange.bind(this)}
                                  aria-describedby="basic-addon2"/>
                          <div className={me.videoUrlSubmitable()} onClick={me.videoUrlDecode.bind(me)}>Submit</div>
                        </div>
                        <hr/>
                        <p>
                                <h5>Or pulling a shared videos</h5>
                        </p>
                </p>)
        },        
        render: function() {
          var me = this;
          return  (<span>
                          {me.pullingYoutube()}
                 </span>)
        }
});
