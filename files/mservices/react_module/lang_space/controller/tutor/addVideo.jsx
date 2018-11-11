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
				option:'', list:[]};
		},
		showMenu : function()  {
			var me = this;
			return (<span>
					{me.state.options.map(function(m){ 
						return  (m.code === me.state.option)? 
							(<a className="btn btn-default disabled" href={'javaScript: void(0);'} style={{'margin':'0.2em'}}>
								{Root.lib.dictionary(m.code)}
							</a>)
							: (<a className="btn btn-success" style={{'margin':'0.2em'}}
							       onClick={me.loadOption.bind(me, m.code) }
								href={'javaScript: void(0);'}>
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
		loadOption : function(code) {
			var me = this;
			me.setState({option:code});
		},
		showOptionBody : function() {
			var me = this;
			return (<div className="overlayer_box homepage_box">
					{me.state.option}			
				</div>);				
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
						<div className="col-sm-12 col-lg-12 col-md-12 overlayer_box homepage_box">
							
							<div style={{'margin':'0em', 'min-height':'36em'}}>
								{me.showMenu()}
								{me.showOptionBody()}
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
