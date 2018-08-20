try {
	var _commPingbo = React.createClass({
		getInitialState: function() {
			var me = this;	
			return {socket_id: Root.state.pingbo_id, 
				pingbo: Root.state.pingbo, 
				pingbo_tm:new Date().getTime()};
		},
		componentWillUnmount : function() {
			let me = this;
			if (Root.qna_server) Root.qna_server.closeSocket();
			me.setState({socket_id: null, pingbo : null});
			if (me._itv) clearInterval(me._itv);
		},
		monitorPingbo : function() {
			let me = this;
			if (me._itv) clearInterval(me._itv);
			me._itv = setInterval(
				function() {
					if (new Date().getTime() - me.state.pingbo_tm > 6000 && (me.state.pingbo)) {
						me.setState({pingbo : null});
					} else if (new Date().getTime() - me.state.pingbo_tm > 2000 && (me.state.pingbo)) {
						if (me.state.pingbo) {
							Root.qna_server.sendToClient({cmd:'pingbo'}, me.state.pingbo);
						}
					}
				}, 1000
			)
		},		
		componentDidUpdate:function(preProps, preState) {
			let me = this;
			if (me.state.socket_id !== preState.socket_id || me.state.pingbo !== preState.pingbo) {
				Root.setState({pingbo_id : me.state.socket_id, pingbo : me.state.pingbo});
				
				//console.log(me.state.socket_id + '==vs===' + preState.socket_id);
				// console.log(me.state.pingbo + '==ps===' + preState.pingbo);
			}

			if (me.state.commData_tm !== preState.commData_tm) {
				me.commPipe();
			}
		},
		componentDidMount:function() {
			let me = this;
			me.monitorPingbo();
			
			let _proxy = ['https://comm1_dev.shusiou.win/', 'http://comm1_dev.shusiou.win/'];
			Root.lib.dependeceCall(
				function() {
					return (typeof _QNA_ === 'function' || typeof _QNA_ === 'object') ? true : false;
				},
				function() {
					if (!Root.qna_server || true) {
						Root.qna_server = new _QNA_();	
						Root.qna_server.init({ 
							master_socket_id: null, 
							link : 'https://comm1_dev.shusiou.win/', 
							proxy: ['http://comm1_dev.shusiou.win/', 
								'https://comm1_dev.shusiou.win/'],
							onConnect : function(socket) {
								me.setState({socket_id:socket.id});		
							}, 
							onServerData : function(incomeData, socket) {
								//console.log('==something coming===>');
								//console.log(incomeData.data);
								let v = {};
								if (incomeData.data.clientMessage) {
								   if (incomeData.data.clientMessage.cmd === 'pingbo') {
									if (incomeData.data.clientMessage.sender) {
										v.pingbo = incomeData.data.clientMessage.sender;
									}
									v.pingbo_tm = new Date().getTime();
									if (incomeData.data.clientMessage.commData) {
										v.commData = incomeData.data.clientMessage.commData;
										v.commData_tm = new Date().getTime();
									}
									me.setState(v);
								   } else {
									if (typeof me.props.parent[incomeData.data.clientMessage.cmd] === 'function') {
										
										v.commData = incomeData.data.clientMessage.commData;
										v.commDataCMD = incomeData.data.clientMessage.cmd;
										v.commData_tm = new Date().getTime();
										me.setState(v);
									}
								   }
								} else {
									me.setState({pingbo : null});
								} 
							},
							timeout :1999
						});
					}
				}

			);
			return true;
		},
		commPipe : function() {
			let me = this;
			if (typeof me.props.parent._voiceRecong === 'function') {
				me.props.parent._voiceRecong(me.state.commData);
			} 
		},
		showData : function(data) {
			return (data === 'string') ? data : JSON.stringify(data);
		},
		render: function() {
			let me = this;
			return (<span>{/*_commPingbo --> {Root.state.pingbo_id} ==>>>{me.state.socket_id} *** {Root.state.pingbo}
					{me.showData(me.state.commData)} */}</span>)
		}
	});	
} catch (err) {
	console.log(err.message);
}
