try {
	var PublicCourses =  React.createClass({
		getInitialState: function() {
			var me = this;
			return { video:{}, list:[]};
		},	
		componentDidMount:function() {
			var me = this;
			setTimeout(me.callEng);
			var str='test1[s]test2';
			var a = str.split(/\[s\]/i);	
		},
		callEng:function() {
			var me = this;
			let engCfg = {
				request:{code:'getPublicList', url : _master_svr() + '/api/curriculum/curriculums.api', method:'post', 
					 data:{cmd:'getPublicList'}
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
		videoImageFilm:function(a, t) {
			var url = 'http://' + a.server_ip + '/api/video/play_stream.api?type=image&vid='+ a.vid +
			    '&w=180&s='+t+'&server='+a.server_ip;			
			return url;
		},
		bgFilmStyle:function(t) {
			var url = 'http://shusiou.com/api/lang_space/video_image.api?video=sample.mp4|'+t;
			return {width:'100%', background:'url('+url+')',
				'background-size':'cover'}
		},		
		render: function() {
			var me = this;
			return (
				<div className="content_section">
					<br/>
					<div className="container">

						{me.state.list.map(function(a){ 
							return(
								<div className="col-sm-4 col-lg-4 col-md-4"> 		
									<div className="overlayer_box homepage_box" style={{'margin-bottom':'1em', 'padding':'0.5em'}}>
										<div className="video_thumbnail_text_top">
											{a.name}	
										</div>
										<_commObj code={'videoImage'}  
											data={{rec:a, width:'100%', ss:90, size:320}}/>
										<div className="video_thumbnail_text">
											<a href={'#/student/my_course/' + a.curriculum_id}>
												<button type="button" 
													className="btn btn-success">
													<i className="fa fa-rocket" aria-hidden="true"></i> 
													&nbsp;&nbsp;{Root.lib.dictionary('start_curriculum')}
												</button>
											</a>	
										</div>										
									</div>	
								</div>			
							)							
						})}										
					</div>	
					
					<br/>					
					
					<br/><br/><br/><br/>
					
					<div className="content_bg opacity_bg"/>					
					{Root.lib.landingModal(me)}
				</div>
			)
		}
	});	
	
} catch (err) {
	console.log(err.message);
}
