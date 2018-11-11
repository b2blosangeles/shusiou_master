try {	
	var My_video_admin =  React.createClass({
		getInitialState: function() {
			var me = this;
			return {video_url:'', vid:'', error:'', list:[], method: ''};
		},
		initState:function() {
			this.setState({video_url:'', vid:'', title:'', length_seconds:0,thumbnail_url:'', error:''});			
		},
		componentDidMount:function() {
			var me = this;	
		},
		componentDidUpdate:function(prePropos, preState) {
			var me = this;
			if (prePropos.id != me.props.id) {
			//	console.log(prePropos.id + '=======' + me.props.id);
				me.setState({video_url:'', vid:'', error:'', list:[]});
			}
		},		
		close_admin:function(){
			var me = this;  
			Root.lib.closePopupWin(me);
		},
		handleChange:function(e) {
			var me = this;
			me.setState({video_url:e.target.value});
		},
		videoUrlValidation:function(){
			var p = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
			return (this.state.video_url.match(p))?true:false;
		},		
		videoUrlSubmitable:function(){
			return (this.videoUrlValidation())?'input-group-addon btn btn-warning':'input-group-addon btn btn-warning disabled';
		},
		videoUrlSubmit:function(){
			var me = this;
			let engCfg = {
				request:{code:'videoUrlSubmit', 
					 url :  _master_svr() + '/api/video/myVideo.api?opt=add', 
					 method:'post', 
					 data:{code: me.state.code}
				},
				hold:500,
				setting: {timeout:6000},
				callBack: function(data) {
					Root.lib.closePopupWin(me.props.parent);
					me.props.parent.callEng();
				}
			}			
			Root.lib.loadEng(me, engCfg);
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
		videoUpload : function() {
			return (<span>upload...</span>);
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
		render:function() {
			var me = this;
			if (!me.state.vid) return me.pullingYoutube();	
			else return (
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
			</p>);
		}
	});
} catch (err) {
	console.log(err.message);
}
