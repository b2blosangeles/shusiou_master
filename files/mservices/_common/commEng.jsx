try {
	var _commEng = React.createClass({		
		getInitialState: function() {
			var me = this;
			return {};
		},
		serial :  function(q, cbk, timeout) {
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
		},
		parallel : function(q, cbk, timeout) {
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
		},
		cp: function() {
			let me = this, p = me.props.parent.state.eng.p;
			    //p = me.props.parent.state.eng.p.shift();
			let q = {};
			for (var i = 0; i < p.length; i++) {
				q['S_'+i] = (function(i) {
					return function(cbk) {
						cbk(p[i]);
					}
				})(i);
			}
			console.log(p.length);
			me.serial(q, 
				function(data) {
					console.log(data);
					me.props.parent.setState({eng:null});
				},
				3000);
		//	alert(JSON.stringify(p));
		//	me.props.parent.setState({eng:me.props.parent.state.eng});
			return true;
		},
		componentDidMount:function() {
			var me = this;
			
		},		
		componentDidUpdate:function(prePropos, prevStat) {
			var me = this;
			if (me.props.parent.state.eng && me.props.parent.state.eng.p && me.props.parent.state.eng.p.length) {
				me.cp();
			}
		},		
		render: function() {
			let me = this, code = (me.props.data) ? me.props.code : '';
			return (<span> -- test  --</span>)
		}
	});	
} catch (err) {
	console.log(err.message);
}
