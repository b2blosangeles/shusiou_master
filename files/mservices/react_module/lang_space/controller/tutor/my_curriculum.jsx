try {
	var MyCurriculumById =  React.createClass({
		getInitialState: function() {
			var me = this;
			me.lib = new _commLib();
			return {
				preview_time:0,
				section:{},
				video:{},
				curriculum:{id:''},
				sections:[],
				langs:[
					{code:'en-US', desc:'English'},
					{code:'cn-ZH', desc:'Chinese'}
				],
				levels:[
					{code:'1', desc:'Entrant level'},
					{code:'2', desc:'Advanced level'}
				],				
				req:0
			};
		},
		mainBox:function() {
			var me = this;
			return (
				<div className="container">
					<div className="col-sm-6 col-lg-5 col-md-6"> 							
						<div className="overlayer_box editor_box">
							{me.leftBox(me.props.params)}
						</div>	
					</div>

					<div className="col-sm-6 col-lg-7 col-md-6"> 
						<div className="overlayer_box editor_box">
							{me.rightBox(me.props.params)}			
						</div>	
					</div>	
				</div>);
		},
		leftBox:function(params) {
			var me = this;
			if (params.opt == 'new') {
				return (<Embed_new_curriculum parent={me} params={params} video={me.state.video}/>);
				
			} else return(<Embed_curriculum_profile parent={me} params={params} video={me.state.video} />);
		},
		rightBox:function(params) {
			var me = this;
			if (params.opt == 'new') {
				return (<Embed_curriculum_preview parent={me} params={params} video={me.state.video}/>);
			} else {
				if (!me.state.section_id) {
					return (<Embed_curriculum_preview parent={me} params={params} video={me.state.video}/>);
				} else {
					return (<TemplateSectionForm env={me.props.route.env} 
							parent={me} params={params} 
							sections={me.state.sections}
							section={me.state.section} section_id={me.state.section_id}/>);	
				}
			} 
		},
		editSection:function(id) {
			var me = this;
			if (id === 'new') {
				me.setState({section:{}, section_id:id});			
			} else {
				let o = me.state.sections;	
				for (var i = 0; i < o.length; i++) {
					if (o[i].section_id == id) {
						me.setState({section:o[i], section_id:id});
						return true;
					}
				} 
			}  			       
		},
		componentDidMount:function() {
			var me = this;
			var vid = '';	
			if (me.props.params['opt'] == 'new') {
				vid = me.props.params['id'];
				me.getVideoInfo(vid,
					function(data) {
						me.setState({vid:vid, video:data.data[0]});
						me.leftBox(me.props.params);
						me.rightBox(me.props.params);				
					}
				);
			} else if (me.props.params['opt'] == 'edit') {
				var cid = me.props.params['id'];
				me.getCurriculumById(cid, function(data) {		
					if (data.data.curriculum_id) {
						me.setState({curriculum:data.data, 
						sections: data.data.sections});
					} 
					me.leftBox(me.props.params);
					me.rightBox(me.props.params);
				});
			}
		},
		componentDidUpdate:function() {
			var me = this;
		},
		closePopup:function() {
			var me = this;
			me.setState({ModalPopup:'cancel'});
			return true;
		},			
		deleteCurriculum: function(params, track) {
			var me = this;			
			let cfg = {
				section: {
					body : function() {
						var ta = me;
						return (
							<div style={{padding:'1em'}}>
								<p>It is going to clean up the curriculum please confirm:</p>
								<button className="btn btn-danger btn_margin6 pull-right" onClick={ta.sendDeleteCurriculum.bind(ta)}>Confirm</button>
								<button className="btn btn-warning btn_margin6 pull-right" onClick={ta.closePopup.bind(ta)}>Cancel</button>
							</div>
						);
					}	
				},
				box_class : 'modal-content',
				popup_type : 'window',
				close_icon :false
			};
			me.lib.buildPopup(me, cfg);
		},
		sendDeleteCurriculum:function() {
			var me = this, curriculum_id = me.state.curriculum.curriculum_id;
			let engCfg = {
				request:{code:'delete_curriculum', 
					 url : _master_svr() + '/api/curriculum/myCurriculum.api', 
					 method:'post', 
					 data:{cmd:'delete', curriculum_id:curriculum_id}
				},
				hold:500,
				setting: {timeout:6000},
				callBack: function(data) {
					if (data.status === 'success') {
						Root.lib.alert(me, 'Delete success!', 'success', 3000);
					} else {
						Root.lib.alert(me, 'API Error: myCurriculum.api access error!', 'danger', 6000);
						
					}
				}
			}
			Root.lib.loadEng(me, engCfg);
		},	
		submitCurriculum:function(v, jump){
			
			var me = this, data = {};
			if (me.state.curriculum.id) {
				data = {cmd:'update', curriculum_id:me.state.curriculum.curriculum_id, vid: me.state.curriculum.vid, 
					name:me.state.curriculum.name, 
					section:me.state.section,
					published:(me.state.curriculum.published)?me.state.curriculum.published:0,
				        sections:me.state.sections,
				        auth:me.props.route.env.state.auth
				};
			} else {
				data = {cmd:'add', vid: me.state.video.vid, name:me.state.curriculum.name, 
					mother_lang:me.state.curriculum.mother_lang, 
					learning_lang:me.state.curriculum.learning_lang, 
					level:me.state.curriculum.level, 					
				        sections:me.state.sections,
					auth:me.props.route.env.state.auth
				       };
			}
			let engCfg = {
				request:{code:'getlist', url : _master_svr() + '/api/curriculum/myCurriculum.api', method:'post', 
					 data:data
				},
				hold:500,
				setting: {timeout:6000},
				callBack: function(data) {
					Root.lib.alert(me, 'Data load success!', 'success', 1000);
					if ((data.data) && v === '') {
						me.props.router.push('/tutor/my_curriculum/edit/'+data.data);
					} else if (jump) {
						me.props.router.push('/tutor/my_curriculums');
					} 
					var cid = me.props.params['id'];
					me.getCurriculumById(cid, function(data) {
						if (data.data.curriculum_id) {
							me.setState({curriculum:data.data,
							sections: data.data.sections});
						} 
					});
				}
			}
			Root.lib.loadEng(me, engCfg);			
		},
		dictionary:function(v) {
			if (!this.props.route || !this.props.route.env ||!this.props.route.env.dictionary) return v;
			return this.props.route.env.dictionary(v);
		},
		exitSection : function() {
			this.setState({section : {},  section_id : null});			
		},		
		refreshSections : function() {
			let me = this;
			me.getCurriculumById(me.state.curriculum.curriculum_id, function(data) {
				if (data.data.curriculum_id) {
					for (var i = 0; i < data.data.sections.length; i++) {
						if (me.state.section_id === data.data.sections[i].section_id) {
							me.setState({sections: data.data.sections});
							return true;
						}
					}
					me.setState({sections: data.data.sections}, function() {
						me.exitSection();
					});
				}
			});			
		},		
		getCurriculumById: function(curriculum_id, cbk) {
			var me = this;
			let engCfg = {
				request:{code:'getlist', url : _master_svr() + '/api/curriculum/myCurriculum.api', method:'post', 
					 data:{ cmd:'getCurriculumById', curriculum_id:curriculum_id,
				      		auth:me.props.route.env.state.auth},
					 dataType: "JSON"
				},
				hold:0,
				setting: {timeout:6000},
				callBack: function(data) {
					if (typeof cbk == 'function') {
						cbk(data);
					}
					/*
					return true;
					
					if (data.status === 'success') {
						me.setState({list:data.data}, function() {
						//	Root.lib.alert(me, 'Data load success!', 'success', 3000);
						});
					} else {
						Root.lib.alert(me, 'API Error: myCurriculum.api access error!', 'danger', 6000);
						
					}*/
				}
			}
			Root.lib.loadEng(me, engCfg);
		},		
		getCurriculumById0: function(curriculum_id, cbk) {
			var me = this;
			me.props.route.env.engine({
				url: _master_svr() + '/api/curriculum/myCurriculum.api',
				method: "POST",
				data: { cmd:'getCurriculumById',
				       curriculum_id:curriculum_id,
				      auth:me.props.route.env.state.auth},
				dataType: "JSON"
			}, function( data) {
				if (typeof cbk == 'function') {
					cbk(data);
				}
			},function( jqXHR, textStatus ) {
				console.log( "Request failed: " + textStatus );
			});
		},	
		handleTextChange:function(event){
			this.setState({c_text: event.target.value});
		},
		saveAble: function() {
			var me = this, A = me.state.list;
			if (!me.state.c_text) return {display:'none'};
			else return {display:''};
		},
		render: function() {
			var me = this;
			return (
				<div className="content_section">
					<br/>
					{me.mainBox()}
					<div className="content_bg opacity_bg"/>
					{Root.lib.landingModal(me)}
				</div>
			)
		}
	});	
	
} catch (err) {
	console.log(err.message);
}
