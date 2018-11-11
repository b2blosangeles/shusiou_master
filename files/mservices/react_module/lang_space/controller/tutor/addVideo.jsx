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
			return (<span>
					{me.state.options.map(function(m){ 
					return(<a className="btn btn-success" 
						       onClick={me.loadModule.bind(me, m.code)}
							href={'javaScript: void(0);'} style={{'margin':'0.2em'}}>
							{Root.lib.dictionary(m.code)}
						</a>)
					})}
					<a className="btn btn-warning pull-right" 
						href={'#/tutor/my_videos'} style={{'margin':'0.2em'}}>
						<i className="fa fa-undo" aria-hidden="true"></i>
						&nbsp;{Root.lib.dictionary('backTo')}
						{Root.lib.dictionary('my_videos')}
					</a>			
				</span>);		
		},
		loadModule : function(code) {
			var me = this;
			alert(code);
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
								{me.showMenu()}
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
