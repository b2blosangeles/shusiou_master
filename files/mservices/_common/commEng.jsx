try {
	var _EngIndex = 0;
	var _commEng = React.createClass({		
		getInitialState: function() {
			_EngIndex = (!_EngIndex || _EngIndex > 10000) ? 1 : (_EngIndex + 1);
			return {id:_EngIndex, ModalLoading:{}};
		},
		ajax: function(CP, rec, done, error) {
			let me = this;
			var comm = new _commLib();
			if (rec.dependence) {
				var depdata = {};
				for (var i = 0; i < rec.dependence.length; i++) {
					depdata[rec.dependence[i]] = CP.data[rec.dependence[i]];
				}
				if ((me.props.parent.mapping) && typeof me.props.parent.mapping[rec.code] === 'function') {
					me.props.parent.mapping[rec.code](CP, rec, depdata);
				} else {
					rec.data.dependence = depdata;
				}
			};

			let p = {
				url:rec.url,
				method: rec.method,
				data: rec.data,
				dataType: (rec.dataType) ? rec.dataType : 'JSON',
				timeout: rec.time_out
			}	
			p.data.auth = (reactCookie.load('auth'))?reactCookie.load('auth'):{};
			$.ajax(p).done(function( data) {
				if (typeof done == 'function') {
					done(data);
				}
			}).fail(function( jqXHR, textStatus ) {
				if (typeof error == 'function') {
					error({status:500, 
					       message:(jqXHR.responseText) ? jqXHR.responseText : 'access error',
					       data:[]
					 });
				}				
			});			
		},
		cpCall: function(eng_cfg) {
			let me = this, comm = new _commLib(), eng = comm.obj2Json(eng_cfg);
			
			let time_out = ((eng.setting) && (eng.setting.timeout)) ? eng.setting.timeout : 6000;
			
			let callBack = ((eng.callBack) && (typeof me.props.parent[eng.callBack] == 'function')) ?
			me.props.parent[eng.callBack] : function() { };
			
			me.err = {};
			let CP = new me.crowdProcess(), Q = {}, err = [];
			for (var i = 0; i < eng.Q.length; i++) {
	
				if (!eng.Q[i].parallel) {
					if (!eng.Q[i].code || Q[eng.Q[i].code] || (err.length)) {
						err[err.length] = 'missing or duplicated code ->' + JSON.stringify(eng.Q[i])
						continue;
					}
					if (!eng.Q[i].time_out) {
						eng.Q[i].time_out = time_out / eng.Q.length;
					}
					Q[eng.Q[i].code] = (function(i) {
						return function(cbk) {
							me.ajax(CP, eng.Q[i], cbk, cbk);
						}
					})(i);
				} else {
					for (var j = 0; j < eng.Q[i].list.length; j++) {
						if (!eng.Q[i].list[j].code || 
						    (Q[eng.Q[i].list[j].code]) ||
						    (err.length)
						   ) {
							err[err.length] = 'missing or duplicated code ->' + JSON.stringify(eng.Q[i])
							continue;
						}						
						Q[eng.Q[i].list[j].code] = function(cbk) {
							cbk(false);
						}
					}
					if (err.length) {
						continue;
					}
					Q['parallel_' + i] = (function(i) {
						return function(cbk) {
							let CPP = new me.crowdProcess(), PQ = {};
							for (var j = 0; j < eng.Q[i].list.length; j++) {
								PQ[eng.Q[i].list[j].code] =  (function(j) {
									return function(cbkp) {
										me.ajax(CP, eng.Q[i].list[j], cbkp, cbkp);
									}
								})(j);
							}
							if (err.length) {
								cbk(false);
							} else {
								CPP.parallel(PQ, 
									function(data1) {
										for (var idx in data1.results) {
											CP.data[idx] = data1.results[idx];
										}
										cbk(null);
								}, time_out);
							}	
						}
					})(i);
				
				}
			}
			if (err.length) {
				console.log(err);
				return true;
			} 
			CP.serial(Q, 
				function(data) {
					//if (!data || data.status != 'success') {
					//	callBack(data);
					//} else {
						let result = {}, report = {};

					console.log('=--ff-->');
						console.log(data.results);
						console.log('=--=data=--=>');
						console.log(data);				
						for (var idx in data.results) {
							console.log(idx);
							if (data.results[idx] === null) delete data.results[idx];
							else {
								result[idx] = {
									status: data.results[idx].status, 
									data :  data.results[idx].data
								}
								report[idx] = data.results[idx];
							}
						}
						if (err.length) {
							console.log(err);
							return true;
						}
						clearInterval(me._itvEng);
						viewpoint.find('.ModalLoading_' + me.state.id).modal('hide');
						me.setState({ModalLoading: {}},function(){
							console.log('===dataA===>');
							console.log({result : result, report : report});
							callBack({result : result, report : report});
						});
					//}
				},
				time_out);	
			
		},
		crowdProcess :  function () {
			this.serial = function(q, cbk, timeout) {
				var me = this;
				var idx = '', tm = new Date().getTime();
				var vtime = (isNaN(timeout) || timeout == 0) ? 6000 : timeout
				me.data = {};	
				var _f = function(o) {
					return function(res) {
						delete q[o];
						idx = '';
						me.data[o] = res;
					}
				}
				var _itv = setInterval(
					function(){
						if (!idx) {
							if (!Object.keys(q).length) {
								clearInterval(_itv);
								cbk({_spent_time:new Date().getTime() - tm, status:'success', 
								     results:me.data});
							} else {
								idx = Object.keys(q)[0];
								if ((q[idx]) && typeof q[idx] == 'function') {
									if (!me.exit) {
										q[idx](_f(idx));
									} else {
										delete q[idx];
										idx = '';
									}
								} 
							}
						}
						if (new Date().getTime() - tm > vtime) {
							clearInterval(_itv);
							cbk({_spent_time:new Date().getTime() - tm, status:'timeout', 
							     results:me.data});
						}				
						return true;
					}
				, 5); 
			};
			this.parallel = function(q, cbk, timeout) {
				var me = this;
				var tm = new Date().getTime(), vtime = (isNaN(timeout) || timeout == 0)?6000:timeout;

				me.data = {};	
				var count_q = 0, count_r = 0;
				for (var o in q) {
					count_q++;	
					var _f = function(o) {
						return function(res) {
							count_r++;
							me.data[o] = res;
						}
					}
					if ((q[o]) && typeof q[o] == 'function') {
						q[o](_f(o));
					} 						
				}
				var _itv = setInterval(
					function(){			
						if (count_q == count_r) {
							clearInterval(_itv);
							cbk({_spent_time:new Date().getTime() - tm, status:'success', results:me.data});
						}
						if (new Date().getTime() - tm > vtime) {
							clearInterval(_itv);
							cbk({_spent_time:new Date().getTime() - tm, status:'timeout', results:me.data});
						}				
						return true;
					}
				, 5); 		
			};
		},		
		componentDidMount:function() {
			var me = this;				
		},	
		componentDidUpdate: function (prevProps, prevState) {
			var me = this;
			if ((me.props.parent) && (me.props.parent.state._eng)) {	
				if (me.props.parent.state._eng === 'cancel') {
					me.props.parent.setState({_eng:null});
					return true
				} else {
					let eng =  JSON.parse(JSON.stringify(me.props.parent.state._eng));
					if (!eng.tm) eng.tm = new Date().getTime();
					eng.hold = (!eng.hold && eng.hold !== 0) ? 1000 : eng.hold;
					me._itvEng = setInterval(
						function() {
							if (new Date().getTime() - eng.tm > eng.hold) {
								me.loading();
								clearInterval(me._itvEng);
							}
						},
						50
					);
					me.props.parent.setState({_eng:'cancel'}, function() {
						me.cpCall(eng);			
					});
				}			
			}		
		},
		loading:function() {
			var me = this;
			me.setState({ModalLoading: {box_style : {color:'#ffffff'}, hold:10, 
				message:'<img src="' + _master_svr() + '/images/loading_spin.gif" width="24">'}},
				function() {
					viewpoint.find('.ModalLoading_' + me.state.id).modal({backdrop:'static'});				    
				    }	   
			);
		},
		ModalLoadingClass: function() {
			let me = this;
			return 'modal fade ModalLoading_'+ me.state.id;
		},			
		render: function() {
			var me = this, err_msg = '';
			var message = (me.state.ModalLoading.message) ? me.state.ModalLoading.message : '', 
			    box_style = (me.state.ModalLoading.box_style) ? me.state.ModalLoading.box_style:{color:'#ffffff'};

			return (			
				<div className={me.ModalLoadingClass()} tabindex="-1" role="dialog" aria-hidden="true">
				  <div className="modal-dialog" role="document">
					<div style={box_style}>
						<span dangerouslySetInnerHTML={{__html: message}}></span>
					</div>
				  </div>
				</div>	
			);
		}		
	});	
} catch (err) {
	console.log(err.message);
}
