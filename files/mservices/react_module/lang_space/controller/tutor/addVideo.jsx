try {	
	var addVideo =  React.createClass({
		getInitialState: function() {
			var me = this;
			return {opt:'', list:[]};
		},	
		componentDidMount:function() {
			var me = this;
			setTimeout(me.callEng);
		},
		componentDidUpdate:function() {
			var me = this;	
		},
		callEng:function() {
			var me = this;
			let engCfg = {
				Q:[
					{code:'getlist', url : _master_svr() +  '/api/video/myVideo.api?opt=getMyVideos', method:'post', 
					 data:{cmd:'getList', auth:me.props.route.env.state.auth},
					 time_out :6000	
					}
				],
				hold:500,
				setting: {timeout:3000},
				callBack: function(data) {
					var EngR = data.EngResult;
					me.setState({
						list:(!EngR  || !EngR.getlist || !EngR.getlist.data) ? [] :
						EngR.getlist.data},
						function() {
							Root.lib.loadSocketIO(me, {
								resource:'/',
								room:'CRON_REPORT',
								onServerData : function(incomeData, socket) {
									console.log('socket.id PP=> ' + socket.id + ' (' + incomeData.data.Y + ')')
								}
							});
							let list = EngR.getlist.data;
							
							for (let i = 0; i < list.length; i++) {
								if (list[i].space_status) continue;
								Root.lib.loadSocketIO(me, {
									resource:'/',
									room:'video_' + list[i].vid,
									onServerData : function(incomeData, socket) {
										if ((incomeData.data) && (incomeData.data.reload)) {
											me.callEng();
											console.log('---reloaded!---');
										}
									}
								});
								console.log('video_' + list[i].vid);
							}
						});	
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
		},
		videoAdmin:function(v) {
			var me = this;
			let cfg = {
				section: {
					body : function() {
						let ta = me, popid = new Date().getTime();
						return (
						<My_video_admin parent={ta} id={popid}/>
						);
					}
				},
				box_class : 'modal-content',
				popup_type : 'window',
				close_icon : true
			};
			Root.lib.popupWin(me, cfg);
			return true;
		},		
		videoInfo: function(rec) {
			var me = this;
			let cfg = {
				section: {
					body : function() {
						let ta = me, popid = new Date().getTime();
						return (
						<Popup_my_video_info parent={ta} rec={rec} id={popid}/>
						);
					}
				},
				box_class : 'modal-content',
				popup_type : 'window',
				close_icon : false
			};
			Root.lib.popupWin(me, cfg);
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
				me.callEng();
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
						<div className="col-sm-12 col-lg-12 col-md-12">
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
