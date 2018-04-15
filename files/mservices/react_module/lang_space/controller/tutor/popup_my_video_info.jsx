try {

	var Popup_my_video_info =  React.createClass({
		getInitialState: function() {
			var me = this;
			return {rec:{}};
		},
		componentDidMount:function() {
			var me = this;
		},	
		componentDidUpdate:function(prePropos, preState) {
			var me = this;
		},			
		close_admin:function(){
			var me = this;  
			alert($('video').length);
			$('video').attr('src', ''); 
			// if ($('video')[0]) $('video')[0].pause();
			me.props.parent.closeAdmin();
		},
		delete_video:function(){
			var me = this;  
			me.props.parent.videoDelete(me.props.rec.vid);
			me.close_admin();
			
		},
		loadVideo:function() {
			var me = this; 
			let rec = me.props.rec);
			return (<span>{rec.vid}=={me.state.rec.vid}</span>)
			/*
			return (function(rec) {
				//return function() {
					return (<_commObj code={'video'} data={{rec : rec, 
							size:800}}/>);
				//}	
			})(rec);
			*/
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
						{me.loadVideo()}
					</div>							
				</div>	
			)	
		}
	});	
	
} catch (err) {
	console.log(err.message);
}
