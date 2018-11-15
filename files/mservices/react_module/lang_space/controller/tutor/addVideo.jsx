try {					
	var addVideo =  React.createClass({
		getInitialState: function() {
			var me = this;
			me.options = {
					'upload_video' : {
						includes : [],
						main : '/files/js/module/fileUpload/main.jsx'
					},
					'pull_youtube' : {
						includes : [],
						main : '/files/js/module/pullYouTube/main.jsx'
					},
					'add_shared_video' : {
						includes : ['/files/js/module/addSharedVideo/test.jsx',
							   '/files/js/module/addSharedVideo/test.jsx'],
						main : '/files/js/module/addSharedVideo/main.jsx'
					}
				};
			
			return {option:''};
		},
		showMenu : function()  {
			var me = this;
			return (<span>
					{Object.keys(me.options).map(function(m){ 
						return  (m === me.state.option)? 
							(<button className="btn btn-default" style={{'margin':'0.2em'}}>
								{Root.lib.dictionary(m)}
							</button>)
							: (<button className="btn btn-success" style={{'margin':'0.2em'}}
							       onClick={me.loadOption.bind(me, m) }>
								{Root.lib.dictionary(m)}
							</button>)
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
		goBackMyVideos : function() {
			var me = this;
			window.location.href = '#/tutor/my_videos';
		},
		showOptionBody : function() {
			var me = this;  
			for (var code in me.options) {
				if (code === me.state.option) {
					return (<div className="overlayer_box homepage_box" 
							style={{'margin-top': '0.5em', 'min-height':'18em'}}>
						<_asyncModule plugin={me.options[code]} code={code} parent={me} />
					</div>)
				}
			}
			return (<span />)			
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
				</div>
			);
		}
	});	
	
} catch (err) {
	console.log(err.message);
}
