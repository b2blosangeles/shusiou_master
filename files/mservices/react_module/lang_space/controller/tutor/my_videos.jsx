try {	
	var My_videos =  React.createClass({
		getInitialState: function() {
			var me = this;
			return {opt:'', list:[]};
		},	
		componentDidMount:function() {
			var me = this;
			me.callEng();
		},
		componentDidUpdate:function() {
			var me = this;
			consoli.log(me.state.opt);
			
		},
		callEng:function() {
			var me = this;
			let engCfg = {
				Q:[
					{code:'getlist', url : _master_svr() +  '/api/video/myVideo.api?opt=getMyVideos', method:'post', 
					 data:{cmd:'getList', auth:me.props.route.env.state.auth}},
					{code:'getlistrr', url : _master_svr() +  '/api/video/myVideoA.api?opt=getMyVideos', method:'post', 
					 data:{cmd:'getList', auth:me.props.route.env.state.auth}}
				],
				hold:500,
				setting: {timeout:10},
				callBack: function(data) {
					me.setState({list:data.result.getlist.data});	
				}
				
			}
			let comm = new _commLib();
			comm.setCallBack(engCfg, me);
			me.setState({_eng:engCfg});
		},		
		componentDidUpdate:function() {
			var me = this;
		},		
		dictionary:function(v) {
			if (!this.props.route || !this.props.route.env ||!this.props.route.env.dictionary) return v;
			return this.props.route.env.dictionary(v);
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
		bgFilmThumbnail:function(v) {
			return {width:'100%', height:'100%', background:'url('+v+')','background-size':'contain'}	
		},		
		bgFilmAddStyle:function(t) {
			var url =  _master_svr() +  '/images/movie_add.png';
			return {width:'100%', background:'url('+url+')',
				'background-repeat':'no-repeat',
			       'background-position':'center',
			       'background-color':'lightyellow'
			       }
		},
		closeAdmin:function(v) {
			var me = this;
			me.setState({ModalPlus:'cancel'});			
			return true;
		},
		gotoAdmin:function(v) {
			var me = this;
			var id = new Date().getTime();
			me.setState({ModalPlus:{type:'popup',  hold:0,
				box_style:{top:'28px'},
				title: (<span>Add a Video</span>),
				message: (<My_video_admin parent={me} id={me.state.popup_id}/>),
				header:(<My_video_admin_header parent={me} id={me.state.popup_id}/>),
				footer:(<My_video_admin_footer parent={me} id={me.state.popup_id}/>)
			}});			
			return true;
		},
		videoInfo:function(rec){
			var me = this;
			var id = new Date().getTime();
			me.setState({ModalPlus:{type:'popup',  hold:0,
				box_style:{top:'28px'},
				title: (<span></span>),
				message: (<Popup_my_video_info parent={me} rec={rec} id={me.state.popup_id}/>),
				header:(<span></span>),
				footer:(<span/>)
			}});
			return true;
		},			
		videoDelete:function(vid){
			var me = this;
			$.ajax({
				url:  _master_svr() +  '/api/video/myVideo.api?opt=removeUserVideo',
				method: "POST",
				data: {vid:vid, auth: me.props.route.env.state.auth},
				dataType: "JSON"
			}).done(function( data) {
				me.pullList();
			}).fail(function( jqXHR, textStatus ) {
				// me.pullList();
			});
		},		
		render: function() {
			var me = this;
			
			return (
				<div className="content_section">	
					<br/>
					<div className="container">
						<div className="col-sm-4 col-lg-4 col-md-4"> 
							<div className="overlayer_box homepage_box" style={{'margin-bottom':'1em', 'padding':'0.5em'}}>
								<a href="JavaScript:void(0)" onClick={me.gotoAdmin.bind(me,'admin')}>
								<img src={ _master_svr() + '/images/film_bg.png'} style={me.bgFilmAddStyle()} />
								</a>	
							</div>			
						</div>
						{me.state.list.map(function(a){ 
							if (a.space_status === 1) return(
							<div className="col-sm-4 col-lg-4 col-md-4"> 
									
									
									
									
								<div className="overlayer_box homepage_box" style={{'margin-bottom':'1em', 'padding':'0.5em'}}>
									<div className="video_thumbnail_icon_group">
										<button type="button" className="btn btn-danger"
											onClick={me.videoInfo.bind(me,a)}>
											<i className="fa fa-play" aria-hidden="true"></i>
										</button>										
									</div>
									<_commObj code={'videoBgImage'}  
										data={{img: _master_svr() + '/images/film_bg.png', 
										rec:a, ss:90, size:320}}/>
								</div>

							</div>							
							)
							else return(
							<div className="col-sm-4 col-lg-4 col-md-4"> 
								<div className="overlayer_box homepage_box" style={{'margin-bottom':'1em', 'padding':'0.5em'}}>
									<img src={ _master_svr() + '/images/film_bg.png'} style={me.bgFilmThumbnail(a.org_thumbnail)} />	
									<div className="video_thumbnail_text video_thumbnail_text_bg pull-right">
										<i className="fa fa-info-circle"></i> {(a.message)?a.message:'Processing ...'}
									</div>
								</div>

							</div>							
							);							
						})}							
					</div>						

					<br/><br/><br/><br/>
					<ModalPlus parent={me} />
					<div className="content_bg opacity_bg"/>
					<_commWin parent={me} /><_commEng parent={me} />
				</div>
			);
		}
	});	
	
} catch (err) {
	console.log(err.message);
}
