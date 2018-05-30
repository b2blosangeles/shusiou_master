(function () { 
	var obj =  function (url) {
		let me = this;
		me.io = require('../socket.io-client/node_modules/socket.io-client');

		me.connect = function () {
			let me = this;
			me.socket = me.io.connect(url, {secure: true, reconnect: true, rejectUnauthorized : false});
		}
		me.sendToRoom = function (room, data, callback) {
			let me = this;
			if (!me.socket || !me.socket.connected) {
				me.connect();
			}
			me.requestID = room + '_' + new Date().getTime();

			me.socket.on('connect', function(){
			    me.socket.emit('createRoom', room);
			    setTimeout(function() {    
				me.socket.emit('clientData', {room: room, data: { requestID:me.requestID, data: data}});
			    });
			});
			me.socket.on('serverData', function(data) {
				if ((data.data) && data.data.requestID === me.requestID) {
					callback('- requestID -' + data.data.requestID + ' - connected -' + me.socket.connected);
					me.socket.disconnect();
					return true;
				}
			});		
		};
	}	
	module.exports = obj;
})();
