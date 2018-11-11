try {	
	var addVideo =  React.createClass({
		getInitialState: function() {
			var me = this;
			return {
				options: [
					{code: 'upload_video'},
					{code: 'pull_youtube'},
					{code: 'add_shared_video'}
				],
				opt:'', list:[]};
		},
		showMenu : function()  {
			var me = this;
			return JSON.stringify(me.state.options) + '***';
			{me.state.options.map(function(m){ 
				return m.code;
				return(<a className="btn btn-success" 
						href={'#/tutor/addVideo'} style={{'margin':'0.5em'}}>
						<i className="fa fa-upload" aria-hidden="true"></i>
						&nbsp;{Root.lib.dictionary(m.code)}===---
					</a>)	
			})};		
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
								style={{'margin-bottom':'1em', 
									'padding':'0.5em', 'min-height':'36em'}}>
								
								{me.showMenu()}===
								
								<a className="btn btn-success" 
									href={'#/tutor/addVideo'}>
									<i className="fa fa-upload" aria-hidden="true"></i>
									&nbsp;{Root.lib.dictionary('upload_video')}
								</a>
								&nbsp;
								<a className="btn btn-success" 
									href={'#/tutor/addVideo'}>
									<i className="fa fa-cloud-download" aria-hidden="true"></i>
									&nbsp;{Root.lib.dictionary('pull_youtube')}
								</a>
								&nbsp;
								<a className="btn btn-success" 
									href={'#/tutor/addVideo'}>
									<i className="fa fa-plus-square" aria-hidden="true"></i>
									&nbsp;{Root.lib.dictionary('add_shared_video')}
								</a>
								&nbsp;								
								<a className="btn btn-warning pull-right" 
									href={'#/tutor/my_videos'}>
									<i className="fa fa-undo" aria-hidden="true"></i>
									&nbsp;{Root.lib.dictionary('backTo')}
									{Root.lib.dictionary('my_videos')}
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
