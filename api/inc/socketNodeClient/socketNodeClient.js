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
				me.socket.emit('createRoom', room);
				me.socket.emit('clientData', {_room: room, _requestID:me.requestID, data: data});
			});
			setTimeout(function() {   
				me.socket.close();
			},1000);			
			me.socket.on('serverData', function(data) {
				if ((data._room) && data._requestID === me.requestID) {
					// me.socket.disconnect();
					callback(data);
				//	callback('- requestID -' + data.data.requestID);
					me.socket.close();
					return true;
				}
			});		
		};
	}	
	module.exports = obj;
})();
