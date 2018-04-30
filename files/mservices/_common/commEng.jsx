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
			let me = this, 
			    si = me.props.parent.state.eng.i, 
			    p = me.props.parent.state.eng.p,
			    s = me.props.parent.state.eng.s;
			
			me.loading();
			
			let CP0 = new me.crowdProcess(), CP = new me.crowdProcess();
			let qp = {};
			for (var i = 0; i < p.length; i++) {
				qp['P_'+i] = (function(i) {
					return function(cbk) {
						me.ajax(p[i], cbk, cbk);
					}
				})(i);
			}
			
			let qs = {};
			for (var i = 0; i < si.length; i++) {
				qs['SA_'+i] = (function(i) {
					return function(cbk) {
						me.ajax(si[i], cbk, cbk);
					}
				})(i);
			}			
			qs['SB_P'] = function(cbk) {
				CP0.parallel(qp, 
					function(data1) {
						cbk(data1);
					},
					6000);	
			};			
			for (var i = 0; i < s.length; i++) {
				qs['SC_'+i] = (function(i) {
					return function(cbk) {
						me.ajax(s[i], cbk, cbk);
					}
				})(i);
			}
			CP.serial(qs, 
				function(data) {
					console.log(data);
					me.props.parent.setState({eng:null}, function()  {
						me.setState({ModalLoading: 'cancel'});	
					});
				},
				30000);
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
							console.log(new Date());
						}
						if (new Date().getTime() - tm > vtime) {
							clearInterval(_itv);
							cbk({_spent_time:new Date().getTime() - tm, status:'timeout', results:me.data});
							console.log(new Date());
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
			if (JSON.stringify(me.props.parent.state.eng) == JSON.stringify(prePropos.parent.state.eng)) {
				console.log('==YY==');
				console.log(JSON.stringify(me.props.parent.state.eng));
				console.log('==XX==');
				console.log(JSON.stringify(prePropos.parent.state.eng));
				return true;
			}
			if (me.props.parent.state.eng && me.props.parent.state.eng.p && me.props.parent.state.eng.p.length) {
				// if (!me.state.ModalLoading || !me.state.ModalLoading.id) {
				// if (!me.state.ModalLoading || me.state.ModalLoading.id !== prevStat.ModalLoading.id) {
				if (!me.state.ModalLoading) {
					
					me.cpCall();
				}
			}
		},
		loading:function() {
			var me = this;
			if (!me._idx || me._idx > 10000) me._idx = 1;
			else me._idx++;
			alert('loading');
			me.setState({ModalLoading: {id : me._idx, box_style : {color:'#ffffff'}, hold:1000, 
				message:'<img src="https://i.stack.imgur.com/oQ0tF.gif" width="24"> Loading --> ' + me._idx}});
		},		
		render: function() {
			let me = this, code = (me.props.data) ? me.props.code : '';
			return (<span> -- testB  --<ModalLoading parent={me} /></span>)
		}
	});	
} catch (err) {
	console.log(err.message);
}
