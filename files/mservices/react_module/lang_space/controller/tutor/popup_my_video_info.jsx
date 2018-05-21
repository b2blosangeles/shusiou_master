try {

	var Popup_my_video_info =  React.createClass({
		getInitialState: function() {
			var me = this;
			// me.lib = new _commLib();
			return {rec:{}};
		},
		componentDidMount:function() {
			var me = this;
		},	
		componentDidUpdate:function(prePropos, preState) {
			var me = this;
		},			
		close_popup:function(){
			var me = this;  
			$('video').attr('src', ''); 
			if ($('video')[0]) $('video')[0].pause();
			Root.lib.closePopup(me);
		},
		delete_video:function(){
			var me = this;  
			me.props.parent.videoDelete(me.props.rec.vid);
			me.close_popup();
			
		},
		render:function() {
			var me = this;
			return (
				<div className="container">
					<div className="row">
						<h4>{me.props.rec.title}</h4>
					</div>
					<div className="row" style={{'padding':'1em', 'padding-top':'0em'}}>
						<div>
							<button type="button" className="btn btn-danger"
								onClick={me.delete_video.bind(me)}>
							<i className="fa fa-trash-o" aria-hidden="true"></i> Delete the video
							</button>
							&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
							<button type="button" className="btn btn-info"
								onClick={me.close_popup.bind(me)}>
							<i className="fa fa-close" aria-hidden="true"></i> Close
							</button>
						</div>	
					</div>	
					<div className="row" style={{'padding':'1em'}}>
						{<_commObj code={'video'} data={{rec : me.props.rec, 
							size:800}}/>}
					</div>							
				</div>	
			)	
		}
	});	
	
} catch (err) {
	console.log(err.message);
}
