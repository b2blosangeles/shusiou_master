try {

	var Popup_my_video_info =  React.createClass({
		getInitialState: function() {
			var me = this;
			return {rec:{}};
		},
		componentDidMount:function() {
			var me = this;
		//	if (me.props) me.setState({rec:me.props.rec});
			console.log('--------componentDidMount--------');
			console.log(me.props.rec);
		},	
		componentDidUpdate:function(prePropos, preState) {
			
			var me = this;
			if (me.props.rec.vid !== prePropos.rec.vid) me.setState({rec:me.props.rec});
			console.log('---------componentDidUpdate--------');
			console.log(me.props.rec);
		},			
		close_admin:function(){
			var me = this;  // $('video').attr('src', ''); 
			if ($('video')[0]) $('video')[0].pause();
			me.props.parent.closeAdmin();
		},
		delete_video:function(){
			var me = this;  
			me.props.parent.videoDelete(me.props.rec.vid);
			me.close_admin();
			
		},					
		render:function() {
			var me = this;
			return (
				<div className="container">
					<div className="row">
						<h4>{me.props.rec.title}</h4>
					</div>
					<div className="row">
						<div style={{'padding-bottom':'0.5em'}}>
							<button type="button" className="btn btn-danger"
								onClick={me.delete_video.bind(me)}>
							<i className="fa fa-trash-o" aria-hidden="true"></i> Delete the video
							</button>
							&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
							<button type="button" className="btn btn-info"
								onClick={me.close_admin.bind(me)}>
							<i className="fa fa-close" aria-hidden="true"></i> Close
							</button>
						</div>	
					</div>	
					<div className="row">
						<_commObj code={'video'} data={{rec:me.state.rec, 
							size:800}}/>
					</div>							
				</div>	
			)	
		}
	});	
	
} catch (err) {
	console.log(err.message);
}
