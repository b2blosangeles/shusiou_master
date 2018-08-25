try {
	var My_curriculums =  React.createClass({
		getInitialState: function() {
			var me = this;
			return {opt:'', list:[]};
		},	
		componentDidMount:function() {
			var me = this;
			setTimeout(me.callEng);
		},		
		callEng:function() {
			var me = this;
			let engCfg = {
				request:{code:'getlist', url : _master_svr() +  '/api/curriculum/myCurriculum.api', method:'post', 
					 data:{cmd:'getList', auth:me.props.route.env.state.auth}
				},
				hold:500,
				setting: {timeout:6000},
				callBack: function(data) {
					if (data.status === 'success') {
						me.setState({list:data.data}, function() {
						//	Root.lib.alert(me, 'Data load success!', 'success', 3000);
						});
					} else {
						Root.lib.alert(me, 'API Error: myCurriculum.api access error!', 'danger', 6000);
						
					}
				}
			}
			Root.lib.loadEng(me, engCfg);
		},					
		componentDidUpdate:function() {
			var me = this;
			Root.lib.routerPermission(Root.state.userInfo, me.props.route.permission);			
		},		
		getCurrentLanguage: function() {
			return this.props.route.env.getCurrentLanguage();	
		},
		getText:function(v) {
			return this.state.text[v][this.getCurrentLanguage()];
		},
		textStyle:function() {
			var me = this;
			if (me.props.route.env.state.Breakpoint == 'sm' || me.props.route.env.state.Breakpoint == 'sx') {
				return {'font-size':'0.8em'}
			} else {
				return {'font-size':'1em'}	
			}
		},		
		newAddThumbnail:function(t) {
			 var idx = Math.floor(Math.random() * (6 - 1) ) + 1;
			var url = _master_svr() + '/images/teacher_' + idx + '.jpg';
			return url;
		},
		render: function() {
			var me = this;
			
			return (
				<div className="content_section">						
					<br/>
					<div className="container">
						<div className="col-sm-4 col-lg-4 col-md-4"> 
							<div className="overlayer_box homepage_box" style={{'margin-bottom':'1em', 'padding':'0.5em'}}>
								<img src={me.newAddThumbnail()} style={{width:'100%'}}/>
								<div className="video_thumbnail_text pull-right">
									<a href={'#/tutor/my_curriculum/new/'}>
									<button type="button" 
										className="btn btn-warning">
										{Root.lib.dictionary('add_curriculum')}
									</button>
									</a>	
								</div>
							</div>			
						</div>
						{me.state.list.map(function(a){ 
							return(
								<div className="col-sm-4 col-lg-4 col-md-4"> 		
									<div className="overlayer_box homepage_box" style={{'margin-bottom':'1em', 'padding':'0.5em'}}>
										<div className="video_thumbnail_text_top">
											{a.name}	
										</div>
										<_commObj code={'videoImage'}  
											data={{rec:a, width:'100%', ss:120, size:320, 
												style: {width:'100%', display:'none'}}}/>
										<div className="video_thumbnail_text">
											<a href={'#/tutor/my_curriculum/edit/' + a.curriculum_id}>
												<button type="button" 
													className="btn btn-warning">
													<i className="fa fa-pencil" aria-hidden="true"></i> 
													&nbsp;&nbsp;{Root.lib.dictionary('edit_curriculum')}
												</button>
											</a>	
										</div>										
									</div>	
								</div>			
							)							
						})}							
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
