React.createClass({
        getInitialState: function() {
                var me = this;
                return {video_url:'',  videof: '', error:'', list:[], method: new Date().getTime()};
        },
        componentDidUpdate:function(prePropos, preState) {
                var me = this;
                // console.log('===parent changed ====');
                // console.log(me.state);
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
				me.setState(data.data); 
			}
                }
		Root.lib.loadEng(me, engCfg);
               // me.props.parent.dataEngine(engCfg); 
               
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
                        <h5>YouTube Video URL ===> {me.state.vid}===</h5>	
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
                return (
			<p style={{'padding':'1em'}}>						
				<div >	
					<div style={{float:'left', padding:'1em'}}> 
						<img src={me.state.thumbnail_url}/>
					</div>					
					<div> 
						<div>
							<h4>{me.state.title}</h4>	
							<p><b>Video ID</b>:{me.state.vid}</p>  
							<p><b>Video Length</b>:({me.state.length_seconds} Secs)</p>
							<p>
								<button type="button" 
									className="btn btn-warning" 
									onClick={me.videoUrlSubmit.bind(me)}>
								Pulling this video</button>
								&nbsp;
								<button type="button" 
									className="btn btn-default" 
									onClick={me.close_admin.bind(me)}>
								Cancel</button>
							</p>
						</div>	
					</div>
				</div>
				<div className="download_matrix">
				{(function() {
					if (me.state.list) {	
						return me.state.list.map(function (item) { 
							if (item == 1) {
								return  (<i className="fa fa-square text-success" aria-hidden="true"></i>)
							} else if (item == 9)  {
								return  (<i className="fa fa-square text-warning" aria-hidden="true"></i>)
							} else {
								return  (<i className="fa fa-square-o" aria-hidden="true"></i>)
							} 
						})
					} else {
						return  (<span>connection ...</span>)
					}
				})()}
				</div>	
			</p>)
        },       
        render: function() {
          	var me = this;
		return (<span>				
			{(!me.state.vid) ? me.pullingYoutube() : me.youtubeInfo()}
			{Root.lib.landingModal(me)}
                	</span>)
        }
});
