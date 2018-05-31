(function () { 
	var obj =  function (url) {
		let me = this;
		me.io = require('/var/qalet/sites/master/api/inc/socket.io-client/node_modules/socket.io-client');

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

			});
			    setTimeout(function() {   
				me.socket.emit('createRoom', room);
				me.socket.emit('clientData', {room: room, data: { requestID:me.requestID, data: data}});
			    },1000);			
			me.socket.on('serverData', function(data) {
				if ((data.data) && data.data.requestID === me.requestID) {
					// me.socket.disconnect();
					callback('- requestID -' + data.data.requestID);
					me.socket.close();
					return true;
				}
			});		
		};
	}	
	module.exports = obj;
})();
