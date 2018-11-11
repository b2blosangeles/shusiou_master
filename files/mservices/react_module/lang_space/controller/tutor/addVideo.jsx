try {	
	var addVideo =  React.createClass({
		getInitialState: function() {
			var me = this;
			return {opt:'', list:[]};
		},
		closeAdmin:function(v) {
			var me = this;
			me.setState({ModalPlus:'cancel'});
		},							
		render: function() {
			var me = this;
			
			return (
				<div className="content_section">	
					<br/>
					<div className="container">
						<div className="col-sm-12 col-lg-12 col-md-12">
							<div className="overlayer_box homepage_box" 
								style={{'margin-bottom':'1em', 'padding':'0.5em', 'min-height':'100px'}}>
								<a className="btn btn-success" 
									href={'#/tutor/addVideo'}>
									{Root.lib.dictionary('upload video')}
								</a>
								&nbsp;
								<a className="btn btn-success" 
									href={'#/tutor/addVideo'}>
									{Root.lib.dictionary('pull video from youtube')}
								</a>
								&nbsp;
								<a className="btn btn-warning" 
									href={'#/tutor/my_videos'}>{Root.lib.dictionary('my_videos')}
								</a>
							</div>	
						</div>
					</div>						

					<br/><br/><br/><br/>
					<div className="content_bg opacity_bg"/>
					{Root.lib.landingModal(me)}
				</div>
			);
		}
	});	
	
} catch (err) {
	console.log(err.message);
}
