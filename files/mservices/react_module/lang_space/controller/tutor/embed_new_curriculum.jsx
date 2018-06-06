try {
	var Embed_new_curriculum =  React.createClass({
		getInitialState: function() {
			var me = this;
			return {curriculum:{},
				langs:me.props.parent.state.langs,
				levels:me.props.parent.state.levels,
				videoList:[]
			       };
		},
		componentDidMount:function() {
			var me = this;
			setTimeout(me.getVideos);
		},

		checkVideo:function(v) {
			var me = this;
			me.props.parent.setState({video:v});	
		},
				
		getVideos:function() {
			var me = this;
			let engCfg = {
				request:{code:'getMyActiveVideos', 
					 url : _master_svr() + '/api/video/myVideo.api?opt=getMyActiveVideos', 
					 method:'post', 
					 data:{}
				},
				hold:1000,
				setting: {timeout:6000},
				callBack: function(data) {
					if (data.status === 'success') {
						me.setState({videoList:data.data}, function() {
							// Root.lib.alert(me, 'Data load success!', 'success', 1000);
						});
					} else {
						Root.lib.alert(me, 'API Error: myCurriculum.api access error!', 'danger', 6000);
						
					}
				}
			}
			Root.lib.loadEng(me, engCfg);						
		},
		bgFilmStyle:function(a) {
			var url =  _node_svr() + '/api/video/pipe.api?space=' + a.space + '&video_fn='+ a.vid +
				      '&size=90&ss='+61;
			return {width:'100%', background:'url('+url+')',
				'background-size':'cover'}
		},				
		save:function(e) {
			var me = this;
			me.props.parent.setState({curriculum:me.state.curriculum}, function() {
				me.props.parent.submitCurriculum('', true);	
			});
		},		
		cancelToSave:function() {
			var me = this;
			me.props.parent.props.router.push('/tutor/my_curriculums');
		},		
		valueChanged:function(code, e) {
			var me = this, curriculum = me.state.curriculum;
			curriculum[code] = e.target.value;
			me.setState(curriculum);
		},
		validation:function() {
			var me = this;
			if (!me.state.curriculum.name || !me.state.curriculum.learning_lang || !me.state.curriculum.mother_lang ||  !me.state.curriculum.level ||
			   !me.props.parent.state.video.id) {
				return false;
			} else {
				return true;
			}
		},
		saveButton:function() {
			var me = this;
			if (me.validation()) return (
				<button className="btn btn-warning btn_margin6"
					onClick={this.save.bind(this)}>{Root.lib.dictionary('save')}</button>
				)
			else return (<button className="btn btn-warning btn_margin6" disabled>
					{Root.lib.dictionary('save')}</button>)
		},		
		render: function() {
			var me = this;
				return (<div>
						<h4>{Root.lib.dictionary('add_curriculum')}</h4> 
						<div className="form-group">
							<div className="dropdown">
							 	<button className="btn btn-default dropdown-toggle" type="button" data-toggle="dropdown">  
								{(function(){ 		
								if ((me.props.parent.state.video) && (me.props.parent.state.video.vid)) return(	  
								<table className="container-fluid">
									<tr>
										<td width="90" valign="top">
											<img src={ _master_svr() + '/images/film_bg.png'} style={me.bgFilmStyle(me.props.parent.state.video)} width="90"/>
										</td>
										<td  width="6"></td>
										<td style={{'text-align':'left',whiteSpace: 'normal',wordWrap: 'break-word', 
												'line-height':'1.2em'}}>
											{me.props.parent.state.video.info.title}
										</td>
										<td  width="6"></td>
										<td  width="12"><span className="caret"></span></td>			
									</tr>		
								</table>)
								else return (<span>Select video <span className="caret"></span></span>)	  
								  })()}		  
							  	</button>
							  <ul className="dropdown-menu" style={{'min-width':'480px', 'max-height': '360px', 'overflow':'auto'}}>
								{me.state.videoList.map(function(a){ 
									return (
									 <li><a href="JavaScript:void(0)" onClick={me.checkVideo.bind(me,a)}>
									<table width="100%" style={{'margin-bottom':'6px'}}>
										<tr>
											<td width="100" valign="top">
												<_commObj code={'videoImage'}  
												data={{rec:a, width:'100%', ss:90, size:90}}/>
											</td>
											<td  width="6"></td>
											<td  style={{'text-align':'left',whiteSpace: 'normal',wordWrap: 'break-word',
													'line-height':'1.2em'}}>
												{a.info.title}<br/>
												{a.video_length} (secs)												
											</td>
										</tr>		
									</table>
									</a></li>		
									)
								})}  		  
							  </ul>
							</div>
						</div>	
						
						
						<div className="form-group">
							<label>{Root.lib.dictionary('curriculum_name')}:</label>
							<input type="text" className="form-control inpit-white-bg" 
								value={me.state.curriculum.name}
								onChange={this.valueChanged.bind(this, 'name')}
								aria-label=""/>
						</div>						

						<div className="form-group">
							<label>{Root.lib.dictionary('mother_language')}:</label>
							<select className="form-control inpit-white-bg"
								onChange={me.valueChanged.bind(me, 'mother_lang')}>
								>
								<option value="">--{Root.lib.dictionary('select_language')}--</option>
								{me.state.langs.map(
									function(lang) {	
										return (<option value={lang.code}>{lang.desc}</option>);
								})}
							</select>
						</div>							

						
						<div className="form-group">
							<label>{Root.lib.dictionary('learning_language')}:</label>
							<select className="form-control inpit-white-bg" 
								onChange={me.valueChanged.bind(me, 'learning_lang')}>
								<option value="">--{Root.lib.dictionary('select_language')}--</option>
								{me.state.langs.map(
									function(lang) {
										if (me.state.curriculum.mother_lang !=lang.code)	
										return (<option value={lang.code}>{lang.desc}</option>);
								})}
							</select>
						</div>													

						<div className="form-group">
							<label>{Root.lib.dictionary('level')}:</label>
							<select className="form-control inpit-white-bg" 
								onChange={me.valueChanged.bind(me, 'level')}>
								<option value="">--{Root.lib.dictionary('select_level')}--</option>
								{me.state.levels.map(
									function(level) {	
										return (<option value={level.code}>{level.desc}</option>);
								})}
							</select>
						</div>																			
						
						<button className="btn btn-default btn_margin6"
							onClick={this.cancelToSave.bind(this)}>{Root.lib.dictionary('cancel')}</button>	
						{me.saveButton()}
						{/*Root.lib.landingModal(me)*/}
					</div>)
		}
	});
	
	
} catch (err) {
	console.log(err.message);
}
