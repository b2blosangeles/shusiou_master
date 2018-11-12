try {					
	var addVideo =  React.createClass({
		getInitialState: function() {
			var me = this;
			me.options = [
					{code: 'upload_video', url : '/files/js/module/fileUpload/main.jsx'},
					{code: 'pull_youtube', url : '/files/js/module/pullYouTube/main.jsx'},
					{code: 'add_shared_video', url : '/files/js/module/addSharedVideo/main.jsx'}
				];
			return {option:'', list:[]};
		},
		showMenu : function()  {
			var me = this;
			return (<span>
					{me.options.map(function(m){ 
						return  (m.code === me.state.option)? 
							(<button className="btn btn-default" style={{'margin':'0.2em'}}>
								{Root.lib.dictionary(m.code)}
							</button>)
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
		OptionBody : function() {
			var me = this;
			for (var i = 0; i < me.options.length; i++) {
				if (me.options[i].code === me.state.option) {
					return (<_asyncModule url={me.options[i].url} />)
				}
			}
			return (<span />)
			/*
			switch (me.state.option) {
				case 'upload_video' :
					return (<_asyncModule url={'/files/js/module/fileUpload/main.jsx'} />)
					break;
				case 'pull_youtube' :
					return (<_asyncModule url={'/files/js/module/pullYouTube/main.jsx'} />)
					break;
				case 'add_shared_video' :
					return (<_asyncModule url={'/files/js/module/addSharedVideo/main.jsx'} />)
					break;					
				default : 
					return (<span />)
			}*/			
		},
		showOptionBody : function() {
			var me = this;
			
			return (!me.state.option) ? '' : 
				(<div className="overlayer_box homepage_box" style={{'margin-top': '0.5em'}}>
					{me.OptionBody()}
					
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
