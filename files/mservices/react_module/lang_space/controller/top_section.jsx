
try {
	var Topsection =  React.createClass({
		getInitialState: function() {
			var me = this;
			return {list: [], hash:window.location.hash};
		},
		role:function(route) {
			var m = this.props.env.matrix;
			for (var i = 0; i < m.length; i++) {
				if (m[i].route == route) {
					return m[i].role;
				}
			}
			return ['*'];
		},
		inte_array: function(a, b) {
			for(var i=0; i < a.length; i++) { if (b.indexOf(a[i]) !== -1) return true;}
			return false;
		},
		myRoles : function() {
			var me = this;
			var my_role = ((me.props.env.state.userInfo) && (me.props.env.state.userInfo.roles)) ?
			    	me.props.env.state.userInfo.roles: [];

			if (my_role.length) return (
				<span>
					[{my_role.map(function(r) {
						return me.props.env.state.roles[r][me.props.env.state.c_lang] + ' ';	
					})}]
				</span>);
		},
		roleMenu: function(c_role)  {
			var me = this;
			var my_role = ( ((Root.state.userInfo) && (Root.state.userInfo.uid)) && (Root.state.userInfo.roles)) ?
			    	Root.state.userInfo.roles: [];
			
			var m = [ 
				{code:'public_courses', router:'public_courses'},
				{code:'my_course', role:['learner'], router:'student/my_courses'},
				{code:'my_videos', router:'tutor/my_videos'},
				{code:'my_curriculums', router:'tutor/my_curriculums'},
				{code:'my_demos', router:'demo'}
			];			
			
			return m.map(function (item) {
				var role = me.role(item.router);
				if  (me.inte_array(my_role,role) || me.inte_array(['*'],role)) {
					return  (me.state.hash !== '#/'+item.router) ?
						(<li><a className={me.isActive(item.code)} href={'#/'+item.router}>{Root.lib.dictionary(item.code)}</a></li>)
						: (<li><a><b>{Root.lib.dictionary(item.code)}</b></a></li>)
				} 
			});		
		},
		docviwer:function(data) {
			return (
				<Docviwer data={data}/>
			)
		},
		isActive:function(v) {
			var k = this.state.hash;
			if (v == k.replace(/\#\//,'')) {
				return 'active';
			}
		},				
		componentDidMount:function() {
			var me = this;
			document.title = Root.lib.dictionary('site_name');
			window.addEventListener("hashchange", function() {
				me.setState({hash:window.location.hash});
			}, false);
		},
		authItem:function() {
			var me = this;
			if ((Root.state.userInfo) && (Root.state.userInfo.uid)) { return(	
				<li className="dropdown">
					<a href="JavaScript:void(0)" className="dropdown-toggle" data-toggle="dropdown"
					>{(Root.state.userInfo.email) ? Root.state.userInfo.email : 'Guest'}
					<span className="caret"></span></a>
					<ul className="dropdown-menu">
						<li><a href="JavaScript:void(0);" onClick={Root.signOut.bind(me)}>{Root.lib.dictionary('menu_logout')}</a></li>
					</ul>	 
				</li>   
			
			) } else {return (
				<li><a href="#/Signin">{Root.lib.dictionary('menu_login')}</a></li>
			)};
		},		
		render: function() {
			var me = this;		
			return (
				<span><br/><br/><br/>
					<nav className="navbar navbar-default navbar-fixed-top header_section">
					  <div className="container-fluid">
						<div className="navbar-header">
						  <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
						<span className="sr-only">Toggle navigation</span>
						<span className="icon-bar"></span>
						<span className="icon-bar"></span>
						<span className="icon-bar"></span>
						  </button>
						  <a className="navbar-brand" href="#"><b>{Root.lib.dictionary('site_legal_name')}</b></a>
						</div>

						<div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
						  <ul className="nav navbar-nav">
							{me.roleMenu(me.props.env.state.c_role)}						  
						  </ul>
						  <ul className="nav navbar-nav navbar-right">  
							{me.authItem()}
							<li className="dropdown">
								<a>{me.myRoles()}</a>
							</li>							  
							<li className="dropdown">
							  <a href="JavaScript:void(0);" className="dropdown-toggle" data-toggle="dropdown" 
								  role="button" aria-haspopup="true" aria-expanded="false">{Root.lib.dictionary('menu_language')}<span className="caret"></span></a>
							  <ul className="dropdown-menu">
								{
									Object.keys(Root.state.lang).map(function (key) {
										if (key != Root.state.c_lang) {
											return  <li><a href="JavaScript:void(0);" onClick={Root.setLang.bind(me,key)}>
												{Root.state.lang[key]}
											</a></li>
										}
									})					  
								}
							  </ul>
							</li>
						  </ul>
						</div>
					  </div>
					</nav>			

				</span>
			  );
		}	
	});	
} catch (err) {
	console.log(err.message);
}
