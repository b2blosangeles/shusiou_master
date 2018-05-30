(function () { 
	var obj =  function () {
		let me = this;
		me.io = require('../socket.io-client/node_modules/socket.io-client');
		me.sendToRoom = function (room, url, data, callback) {
			let me = this;
			me.socket = me.io.connect(url, {secure: true, reconnect: true, rejectUnauthorized : false});
			me.requestID = room + '_' + new Date().getTime();

			me.socket.on('connect', function(){
			    me.socket.emit('createRoom', room);
			    setTimeout(function() {
				    
				me.socket.emit('clientData', {room: room, data: { requestID:me.requestID, data: data}});
			    });
			});
			me.socket.on('serverData', function(data) {
				if ((data.data) && data.data.requestID === me.requestID) {
					
					if((me.socket.rooms) && (me.socket.rooms.length)){
					    callback('A' + me.socket.rooms.length);
					  }else{
					    callback(me.socket.rooms);
					  }
					me.socket.disconnect();
					//callback(me.requestID + '===---' + data.data.requestID);
				}
			});		
		};
	}	
	module.exports = obj;
})();
