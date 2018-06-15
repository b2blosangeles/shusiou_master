try {		
	var TemplateSectionForm =  React.createClass({
		getInitialState: function() {
			var me = this; 
			return {
				scriptLangs:[],
				scriptList:[],
				scriptListFilter:{},
				script_id:0,
				data:{},
				c_tpl:{}
			};
		},
		componentDidMount:function() {
			var me = this;
			let engCfg = {
				request:{
					code:'getAll', 
					url: _master_svr() +  '/api/content_data/getScripts.api', 
					method:'post',
					data: {cmd:'getAll', auth:me.props.parent.props.route.env.state.auth}
				},
				hold:0,
				setting: {timeout:3000},
				callBack: function(data) {
					me.setState({scriptLangs:data.langs, scriptList:data.list});
				}
			}
			Root.lib.loadEng(me, engCfg);				
			me.setTpl({});
		},
		componentDidUpdate:function(prePropos, prevState) {	
			var me = this;
			if (me.state.script_id  !== prevState.script_id) {
				me.loadScriptById(me.state.script_id);
				me.setTpl({});
			} else {
				if (me.props.section_id !== prePropos.section_id) {
					if (me.props.section_id === 'new') {
						me.setTpl({});
					} else {
						me.setTpl(me.props.section.tpl);
					}	
				}
			}
		},
		loadScriptById:function(id) {
			var me = this;
			let engCfg = {
				request:
					{code:'getlist', url : _master_svr() +  '/api/content_data/getScripts.api', method:'post', 
					 data: {cmd:'getScriptById', id: id, auth:me.props.parent.props.route.env.state.auth},
				},
				hold:0,
				setting: {timeout:3000},
				callBack: function(data) {
					me.setState({c_tpl:data});
				}
			}
			Root.lib.loadEng(me, engCfg);			
		},
		setStateData(idx, data) {
			var me = this, v = (me.state.data) ? me.state.data : {};
			v[idx] = data;
			me.setState({data:v});
		},
		handleChange(idx, event) {
			var me = this;
			if (event.target.type == 'text') {
				me.setStateData(idx, event.target.value)
			}
		},
		setTpl(data) {
			var me = this;
			if (me.props.section.section_id == 'new') {
				me.setState({c_tpl:data, data:{}});
			} else {
				me.setState({c_tpl:(me.props.section.tpl)?me.props.section.tpl:data, 
					data:me.props.section.data});
			}	
		},
		popupEditVideo: function(track) {
			var me = this;
			let cfg = {
				section: {
					body : function() {
						let ta = me, popid = new Date().getTime();
						let video = {
							vid: ta.props.parent.state.curriculum.vid,
							space : ta.props.parent.state.curriculum.space,
							video_length : ta.props.parent.state.curriculum.video_length
						};
						return (
						<Embed_video_editor parent={ta} video={video} 
							sections={ta.props.sections} track={track}  
							popid={popid} section_id={ta.props.section_id} />
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
		setScriptListFilter(p) {
			let me = this, o = me.state.scriptListFilter;
			if (p.id) {
				me.setState({script_id:p.id});
			}
			for (var k in p)  o[k] = p[k];
			me.setState({scriptListFilter:o});
		},
		langField: function(rec) {
			var me = this;
			return (
				<div className="dropdown">
				  <button className="btn btn-default dropdown-toggle  inpit-white-bg" type="button" data-toggle="dropdown">
					  {rec.lang}&nbsp;
				  <span className="caret"></span></button>
				  <ul className="dropdown-menu">
				    <li><a href="JavaScript:void(0)" onClick={me.handleLang.bind(me, rec, me.state.c_section.lang.mother)}> {me.state.c_section.lang.mother}</a></li>
				    <li><a href="JavaScript:void(0)" onClick={me.handleLang.bind(me, rec, me.state.c_section.lang.learning)}> {me.state.c_section.lang.learning}</a></li>
				  </ul>
				</div>	
			)	       
		},
		textField: function(idx) {
			var me = this;
			if (idx === 'description') {
				return (
					<span>
						<table className="table">
						  <thead>
						    <tr>
						      <th scope="col"></th>
						      <th scope="col">Answer</th>
						      <th scope="col"><i className="fa fa-plus-square fa-2"></i></th>
						    </tr>
						  </thead>
						  <tbody>
						    <tr>
						      <th scope="row"></th>
						      <td><input className="form-control inpit-white-bg" 
							placeholder={'input text ' + idx} 
							value={me.state.data[idx]}  
							onChange={me.handleChange.bind(me, idx)}/></td>
						      <td> <i className="fa fa-trash fa-2"></i></td>
						    </tr>
						  </tbody>
						</table>							
					</span>		
				)			
			} else {
				return (
					<span>
						<p><input className="form-control inpit-white-bg" 
							placeholder={'input text ' + idx} 
							value={me.state.data[idx]}  onChange={me.handleChange.bind(me, idx)}  />
						</p>				
					</span>		
				)
			}
		},
		answerField: function(idx) {
			var me = this;
			return (
			<span>
				
				<p><input className="form-control inpit-white-bg" 
					placeholder={'input text ' + idx} 
					value={me.state.data[idx]}  onChange={me.handleChange.bind(me, idx)}  />
				</p>
				<p><input className="form-control inpit-white-bg" 
					placeholder={'input text ' + idx} 
					value={me.state.data[idx]}  onChange={me.handleChange.bind(me, idx)}  />
				</p>
			</span>		
			)	       
		},		
		acceptSection: function() {
			let me = this;
			let data = {section_id:me.props.section_id, tpl:me.state.c_tpl, data:me.state.data, c_section:me.state.c_section};
			me.saveCurriculum(data);
		},
		saveSection:function(opt){
			var me = this;
			let engCfg = {
				request:
					{code:'saveSection', 
					 url : _master_svr() + '/api/curriculum/myCurriculum.api', 
					 method:'post', 
					 data: { 
						 cmd:opt,
						 data:{
						    curriculum_id : me.props.parent.state.curriculum.curriculum_id,
						    section_id: me.props.section_id,
						    tpl:me.state.c_tpl, 
						    data:me.state.data}
					 },
				},
				hold:0,
				setting: {timeout:3000},
				callBack: function(data) {
					if (!data || data.status !== 'success') {
						Root.lib.alert(me, 'Error! ' + ((data) ? data.message : ''), 'danger');
					} else {
						//  Root.lib.alert(me, 'Data successfully saved!', 'success', 1000);
						me.props.parent.refreshSections();
					}
				}
			}
			Root.lib.loadEng(me, engCfg);
		},		
		templateSelectScript: function() {
			let me = this, scriptLangs = me.state.scriptLangs, scriptList = me.state.scriptList;
			return (
				<span>
				<table className="textRecField" width="100%"  style={{border:'0px solid transparent'}}>
				<tr>
					<td>
						<div className="dropdown">
						  <button className="btn btn-default dropdown-toggle  inpit-white-bg" type="button" data-toggle="dropdown">
							  {(me.state.scriptListFilter.lang)?me.state.scriptListFilter.lang:'Select Language Solution'} 
							  <span className="caret"></span></button>						
						  <ul className="dropdown-menu">					  
							{scriptLangs.map(function(m) {
							return (<li><a href="JavaScript:void(0)" onClick={me.setScriptListFilter.bind(me, {lang:m})}>{m}</a></li>);	
							})}
						  </ul>
						</div>						
					</td>
					<td>
						<div className="dropdown">
						  <button className="btn btn-default dropdown-toggle  inpit-white-bg" type="button" data-toggle="dropdown">
							   {(me.state.script_id)?me.state.script_id:'Select Script'} 
						  <span className="caret"></span></button>
						  <ul className="dropdown-menu">					  
							{scriptList.map(function(m) {
								if (!me.state.scriptListFilter.lang || me.state.scriptListFilter.lang == m.lang) {
								return (<li><a href="JavaScript:void(0)" onClick={me.setScriptListFilter.bind(me, {id:m.id})}>{m.description}</a></li>);	
								} 
							})}
						  </ul>
						</div>								
					</td>						
				</tr>
				</table>
				</span>	
			)	       
		},
		tplSection : function (rec) {
			let me = this;
			if (me.state.c_tpl.variables) {
				return (
					<span>		
					{me.state.c_tpl.variables.map(function(v) {
						if (!me.state.data || !me.state.data[v]) {
							me.setStateData(v, {});
							return(<span>niu</span>)
						}								
						switch(v) {
							case 'track':
								if (!me.state.data || !me.state.data[v]) {
									me.setStateData(v, {});
								}
								return (
								<span>
									{(function() {
										return (<span dangerouslySetInnerHTML=
										{{__html: 'Start: ' + Root.lib.toHHMMSS(me.state.data[v].s) + 
										' To:' + Root.lib.toHHMMSS(parseInt(me.state.data[v].s) + parseInt(me.state.data[v].t))}}
										/>)
									})()}
									<button className="btn btn-info btn-xs" 
										onClick={me.popupEditVideo.bind(me, me.state.data[v])}>
									<i className="fa fa-scissors" aria-hidden="true"></i> Clip video
									</button>										
								</span>
								);
								break;								
							case 'answer':
							case 'description':
								return me.textField(v);
								break;
							 default:
								return '<span>-- undefined variable' + v + '<s/pan>';
						}
					})}
					<table width="100%" className="section_template_frame">	
						<tr className=""><td>
							<div className="container-fluid" style={{padding:'6px', 'text-align':'center'}}>
								{(function() {
									if (me.props.parent.state.section.id != 'new') return (<button className="btn btn-danger" 
									onClick={me.saveSection.bind(me, 'deleteSection')}>Delete This Section</button>)
								})()}	
								<button className="btn btn-default pull-left" onClick={me.props.parent.exitSection.bind(me)}>Abort Change</button>
								<button className="btn btn-info pull-right" onClick={me.saveSection.bind(me, 'saveSection')}>Save</button>
							</div>
						</td></tr>	
					</table>						
					</span>)
			} else {
				return (<span>select a script</span>)
			}
		},							
		render: function() {
			var me = this;
			return (<span>
				{me.props.parent.state.curriculum.mother_lang} - ||
				{me.props.parent.state.curriculum.learning_lang} - 
				{me.props.parent.state.curriculum.level}
				{me.templateSelectScript()}
				{me.tplSection()}
				</span>)
		}
	});	
	
} catch (err) {
	console.log(err.message);
}
