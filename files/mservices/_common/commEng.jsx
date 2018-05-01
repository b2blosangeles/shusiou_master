try {
	var _commEng = React.createClass({		
		getInitialState: function() {
			var me = this;
			return {};
		},
		ajax: function(rec, done, error) {
			var me = this;
			let p = {
				url:rec.url,
				method: rec.method,
				data: rec.data,
				dataType: "JSON"
			}			
			p.data.auth = (reactCookie.load('auth'))?reactCookie.load('auth'):{};
			$.ajax(p).done(function( data) {
				if (typeof done == 'function') {
					done(data);
				}
			}).fail(function( jqXHR, textStatus ) {
				if (typeof error == 'function') {
					error(jqXHR, textStatus);
				}				
			});			
		},
		cpCall: function() {
			let me = this, eng =  JSON.parse(JSON.stringify(me.props.parent.state.eng));			
			me.props.parent.setState({eng:null}, function()  {});
			
			let time_out = ((eng.setting) && (eng.setting.timeout)) ? eng.setting.timeout : 6000;
			let callbackfn = ((eng.callbackfn) && (typeof me.props.parent[eng.callbackfn] == 'function')) ?
			    me.props.parent[eng.callbackfn] : function() { };
			    
			me.loading();
			
			let CP0 = new me.crowdProcess(), CP = new me.crowdProcess();
			let qp = {};
			for (var i = 0; i < eng.p.length; i++) {
				qp['P_'+i] = (function(i) {
					return function(cbk) {
						me.ajax(eng.p[i], cbk, cbk);
					}
				})(i);
			}
			
			let qs = {};
			for (var i = 0; i < eng.i.length; i++) {
				qs['SA_'+i] = (function(i) {
					return function(cbk) {
						me.ajax(eng.i[i], cbk, cbk);
					}
				})(i);
			}			
			qs['SB_P'] = function(cbk) {
				CP0.parallel(qp, 
					function(data1) {
						cbk(data1);
					},
					time_out);	
			};			
			for (var i = 0; i < eng.s.length; i++) {
				qs['SC_'+i] = (function(i) {
					return function(cbk) {
						me.ajax(eng.s[i], cbk, cbk);
					}
				})(i);
			}
			CP.serial(qs, 
				function(data) {
					me.setState({ModalLoading: 'cancel'},function(){
						callbackfn(data);
					});
				},
				time_out);
			return true;
		},
		crowdProcess :  function () {
			this.serial = function(q, cbk, timeout) {
				var me = this;
				var idx = '', tm = new Date().getTime();
				var vtime = (isNaN(timeout) || timeout == 0)?6000:timeout
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
								cbk({_spent_time:new Date().getTime() - tm, status:'success', results:me.data});
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
							cbk({_spent_time:new Date().getTime() - tm, status:'timeout', results:me.data});
						}				
						return true;
					}
				, 1); 
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
				, 1); 		
			};
		},		
		componentDidMount:function() {
			var me = this;				
		},		
		componentDidUpdate:function(prePropos, prevStat) {
			var me = this;
			if (me.props.parent.state.eng && me.props.parent.state.eng.p && me.props.parent.state.eng.p.length) {
				if (!me.state.ModalLoading) {
					me.cpCall();
				} 
			} 
		},
		loading:function() {
			var me = this;
			me._idx = (!me._idx || me._idx > 10000) ? 1 : (me._idx + 1);
			me.setState({ModalLoading: {id : me._idx, box_style : {color:'#ffffff'}, hold:10, 
				message:'<img src="https://i.stack.imgur.com/oQ0tF.gif" width="24"> Loading --> ' + me._idx}});
		},		
		render: function() {
			let me = this, code = (me.props.data) ? me.props.code : '';
			return (<ModalLoading parent={me} />)
		}
	});	
} catch (err) {
	console.log(err.message);
}
