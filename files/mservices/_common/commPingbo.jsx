try {
	var _commPingbo = React.createClass({
		getInitialState: function() {
			var me = this;
			if (!_commPingbo.unicode || _commPingbo.unicode > 99999) {
				_commPingbo.unicode = 1;
			} else {
				_commPingbo.unicode++;
			}	
			return {};
		},
		componentDidMount:function() {
			let me = this;
			// me.monitorPingbo();
			let _proxy = ['https://comm1.service.dev.shusiou.win/', 'http://comm1.service.dev.shusiou.win/'];
			Root.lib.dependeceCall(
				function() {
					return (typeof _QNA_ === 'function' || typeof _QNA_ === 'object') ? true : false;
				},
				function() {
					me.qna_server = new _QNA_();	
					me.qna_server.init({ 
						master_socket_id: null, 
						link : 'https://comm1.service.dev.shusiou.win/', 
						proxy: ['http://comm1.service.dev.shusiou.win/', 
							'https://comm1.service.dev.shusiou.win/'],
						onConnect : function(socket) {
							me.props.parent.setState({socket_id:socket.id});				
						}, 
						onServerData : function(incomeData, socket) {
							console.log('==something coming===>');
							if (incomeData.data.clientMessage.cmd === 'pingbo'); {
								me.setState({pingbo:incomeData.data.clientMessage.sender, 
									     pingbo_tm: new Date().getTime()});
							}
						},
						timeout :1999
					});
				}

			);
			return true;
		},		
		render: function() {
			let me = this;
			return (<span>_commPingbo --> {me.props.parent.state.socket_id} </span>)
		}
	});	
} catch (err) {
	console.log(err.message);
}
