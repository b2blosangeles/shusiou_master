try {
	var _commPingbo = React.createClass({
		getInitialState: function() {
			var me = this;	
			return {socket_id: me.props.parent.state.socket_id, 
				pingbo: me.props.parent.state.pingbo, 
				pingbo_tm:new Date().getTime()};
		},
		componentWillUnmount : function() {
			let me = this;
			if (me.props.parent.qna_server) me.props.parent.qna_server.closeSocket();
			me.setState({pingbo : null});
			if (me._itv) clearInterval(me._itv);
		},
		monitorPingbo : function() {
			let me = this;
			if (me._itv) clearInterval(me._itv);
			me._itv = setInterval(
				function() {
					if (new Date().getTime() - me.state.pingbo_tm > 6000 && (me.state.pingbo)) {
						me.setState({pingbo : null});
					} else if (new Date().getTime() - me.state.pingbo_tm > 3000 && (me.state.pingbo)) {
						if (me.state.pingbo) {
							me.props.parent.qna_server.sendToClient({cmd:'pingbo'}, me.state.pingbo);
						}
					} 
					//me.setState({parent_location : me.props.parent.props.location.pathname});
				}, 1000
			)
		},		
		componentDidUpdate:function(preProps, preState) {
			let me = this;
			if (me.state.socket_id !== preState.socket_id || me.state.pingbo !== preState.pingbo) {
				me.props.parent.setState({socket_id : me.state.socket_id, pingbo : me.state.pingbo});
				//console.log(me.state.socket_id + '==vs===' + preState.socket_id);
				//console.log(me.state.pingbo + '==ps===' + preState.pingbo);
			}
			console.log(me.props.parent.state.outData);
		},
		componentDidMount:function() {
			let me = this;
			me.monitorPingbo();
			let _proxy = ['https://comm1.service.dev.shusiou.win/', 'http://comm1.service.dev.shusiou.win/'];
			Root.lib.dependeceCall(
				function() {
					return (typeof _QNA_ === 'function' || typeof _QNA_ === 'object') ? true : false;
				},
				function() {
					if (!me.props.parent.qna_server) {
						me.props.parent.qna_server = new _QNA_();	
						me.props.parent.qna_server.init({ 
							master_socket_id: null, 
							link : 'https://comm1.service.dev.shusiou.win/', 
							proxy: ['http://comm1.service.dev.shusiou.win/', 
								'https://comm1.service.dev.shusiou.win/'],
							onConnect : function(socket) {
								me.setState({socket_id:socket.id});				
							}, 
							onServerData : function(incomeData, socket) {
								//console.log('==something coming===>');
								//console.log(incomeData.data);
								let v = {};
								if ((incomeData.data.clientMessage) && 
								    incomeData.data.clientMessage.cmd === 'pingbo') {
									if (incomeData.data.clientMessage.sender) {
										v.pingbo = incomeData.data.clientMessage.sender;
									}
									v.pingbo_tm = new Date().getTime();
									if (incomeData.data.clientMessage.commData) {
										v.commData = incomeData.data.clientMessage.commData;
									}
									me.setState(v);
								} else if (incomeData.data.clientMessage === null) {
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
		showData: function(data) {
			let me = this;
			return (data === 'string') ? data : JSON.stringify(data);
		},		
		render: function() {
			let me = this;
			return (<span>_commPingbo --> {me.props.parent.state.socket_id} ==>
					{me.showData(me.state.commData)}</span>)
		}
	});	
} catch (err) {
	console.log(err.message);
}
