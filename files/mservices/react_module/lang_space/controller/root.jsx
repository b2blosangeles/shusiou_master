
try {
	var shusiou_url = location.protocol+'//'+window.location.hostname;
	if (location.protocol !== 'https:') {
		window.location.href = window.location.href.replace(shusiou_url, 'https://' + window.location.hostname);
	} else {
		var Root =  React.createClass({
			moduleName : 'root',
			getInitialState: function() {
				var me = this;
				Root = me;
				me.lib = new _commLib();
				
				return {
					dictionary:_DATA_["/data/dictionary.json"],
					lang:_DATA_["/data/language.json"],
					roles:_DATA_["/data/user_role.json"],
					c_lang:(!reactCookie.load('lang'))?'cn':reactCookie.load('lang'),
					userInfo: {}
				};
			},			
			inte_array: function(a, b) {
				for(var i=0; i < a.length; i++) { if (b.indexOf(a[i]) !== -1) return true;}
				return false;
			},
			dictionary: function(v) {
				return Root.lib.dictionary(v);
			},
			getCurrentLanguage: function() {
				return this.state.c_lang;
			},	
			setLang: function(v) {
				Root.setState({c_lang: v}, function() {
					document.title = Root.lib.dictionary('site_name');
				});
				// reactCookie.save('lang', v, { path: '/', maxAge: 3 });
				reactCookie.save('lang', v, { path: '/'});
			},
			signOut:function() {
				var me = this;	
				let engCfg = {
					request:{
						code:'getAll', 
						url: _master_svr() +  '/api/auth/auth.api', 
						method:'post',
						data: {cmd:'signout'}
					},
					hold:0,
					setting: {timeout:3000},
					callBack: function(data) {
						if (data.status === 'success') {
							Root.setState({'userInfo': null}, function() {
								reactCookie.remove('auth', { path: '/'});
								window.location.href = '/#/';
							});
						} else {
							Root.lib.alert(me, 'Error! ' + 
								(((data) && (data.message)) ? data.message : '' ), 'danger');
						}
						return true;
					}
				}
				Root.lib.loadEng(Root, engCfg);			
			},
			getAuth:function() {
				var me = this;	
				let engCfg = {
					request:{
						code:'getAuthUser', 
						url: _master_svr() +  '/api/auth/auth.api', 
						method:'post',
						data: {cmd:'getAuthUser'}
					},
					hold:2000,
					setting: {timeout:3000},
					callBack: function(data) {
						if (data.status === 'success') {
							Root.setState({'userInfo': data.data});
						} else {
							Root.setState({'userInfo': null});
							Root.lib.alert(me, 'Error! ' + 
								(((data) && (data.message)) ? data.message : '' ), 'danger');
						}
						return true;
					}
				}
				Root.lib.loadEng(Root, engCfg);			
			},
			componentDidMount:function() {	
				var me = this;
				me.getAuth();

			},
			requireAuth:function(nextState, replace) {
				var me = this;
			  if (!me.state.userInfo || !me.state.userInfo.uid) {
			    replace({
			      pathname: '/Signin',
			      state: { nextPathname: nextState.location.pathname }
			    })
			  }
			},
			routeMatrix:function() {
				var me = this;
				var my_role = ((me.state.userInfo) && (me.state.userInfo.roles)) ? 
				    me.state.userInfo.roles : [];
				
				me.matrix = [
					{route:'tutor/my_curriculums', role:['teacher'], auth:true, component:My_curriculums},
					{route:'tutor/my_curriculum/:opt/', role:['teacher'],  auth:true, component:MyCurriculumById},
					{route:'tutor/my_curriculum/:opt/:id', role:['teacher'],  auth:true, component:MyCurriculumById},
					{route:'tutor/my_videos', role:['teacher'],  auth:true, component:My_videos},

					{route:'public_courses', role:['*'], component:PublicCourses},
					{route:'student/my_courses', role:['learner'],  auth:true, component:Mycourse},
					{route:'student/my_course/:id', role:['*'],  auth:true, component:Mycoursebyid},

					{route:'demos', role:['*'],  auth:false, component:MyDemos},
					{route:'demo/:id', role:['*'],  auth:false, component:MyDemo},
					
					{route:'Signin', role:['*'], auth:false, component:Signin},
					{route:'Signup', role:['*'], auth:false, component:Signup},
					{route:'Doc/:code', role:['*'], auth:false, component:DocviewPage},
					{route:'/', role:['*'], auth:false, component:Ad},
					{route:'*', role:['*'], auth:false, component:ErrorPage}
				];			
				return (
					<span>
					{me.matrix.map(function(m){ 
						let permission = {
							role : m.role,
							auth : m.auth
						} 						
						return(<Route path={m.route} env={me} permission={permission} component={m.component} />)	
					})};
					</span>	
				);
			},		
			render: function() {
				var me = this;		
				return (
					<span>
						<Topsection env={me}/>

						<ReactRouter.Router history={hashHistory}>
							<IndexRoute env={me} component={Ad}/>
							{me.routeMatrix()}
						</ReactRouter.Router>

						<Footsection env={me}/>
						<Breakpoints env={me}/>
						{Root.lib.landingModal(me)}
						<_commObj  parent={me} data={{}} code={'audio'}/>
					</span>
				  );
			}	
		});
	}
} catch (err) {
	console.log(err.message);
}
