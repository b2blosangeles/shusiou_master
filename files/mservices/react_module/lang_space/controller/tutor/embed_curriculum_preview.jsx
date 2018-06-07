try {
	var Embed_curriculum_preview =  React.createClass({
		getInitialState: function() {
			var me = this;
			return {};
		},	
		componentDidMount:function() {
			var me = this;
			if (me.props.params.opt == 'new') {
				// me.getVideos();
				/*
				me.props.parent.getVideoInfo(me.props.params.id,
					function(data) {
						me.props.parent.setState({video:data.data[0]});
					}
				);*/
			}
		},
		videoImage:function(t, a) {
			var url =  _node_svr() + '/api/video/pipe.api?space=' + a.space + '&video_fn='+ a.vid +
				      '&size=320&ss='+t;
			return '';
		},
		checkVideo:function(id) {
			var me = this;
			if (me.state.vid == id) {
				me.setState({vid:''});
			} else {
				me.setState({vid:id});
			}	
		},		
		render: function() {
			var me = this;
			if (me.props.parent.state.curriculum.vid) {
				return (<div>Embed_curriculum_preview
						<div>{me.props.params.opt}
							{JSON.stringify(me.props.parent.state.curriculum)}
							{/*
							<h4>{me.props.parent.state.video.title}</h4>	
							<p><b>Video ID</b>:{me.props.parent.state.curriculum.vid}</p>  
							<p><b>Video Length</b>:({me.props.parent.state.curriculum.video_length} Secs)</p>
							<img src={me.videoImage(61, props.parent.state.curriculum)}/>
							*/}
						</div>	
					
					</div>)
			} else {
				return (<div>Embed_curriculum_preview == {me.props.parent.state.curriculum.vid}
					== {me.props.params.opt}
					</div>)
			}
		}
	});
	
	
} catch (err) {
	console.log(err.message);
}
