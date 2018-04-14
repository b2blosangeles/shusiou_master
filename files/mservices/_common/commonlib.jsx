try {
	var _commonLib = React.createClass({
		videoImageUrl : function() {
			return 'aaa';
		},
		render: function() {
			var me = this;
			if ((me.props.params.id) && (me.props.parent.state.curriculum)) {
				return (<div>Embed_curriculum_demo 1 =={_commonLib.videoImageUrl()}
						<div>
							<h4>{me.props.parent.state.video.title}</h4>	
							<p><b>Video ID</b>:{me.props.parent.state.curriculum.vid}</p>  
							<p><b>Video Length</b>:({me.props.parent.state.curriculum.video_length} Secs)</p>
							<img src={me.videoImage(61, me.props.parent.state.curriculum)}/></div>	
					
					</div>)
			} else {
				return (<div>Embed_curriculum_preview 2</div>)
			}
		}
	});	
} catch (err) {
	console.log(err.message);
}
