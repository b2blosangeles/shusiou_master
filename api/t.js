var io = require('/var/qalet/sites/master/api/inc/socket.io-client/node_modules/socket.io-client');
let socket = io.connect("https://dev.shusiou.win/", {secure: true, reconnect: true, rejectUnauthorized : false});
let requestID = 'asedk';
socket.on('connect', function(){
    socket.emit('createRoom', 'VID_NIU');
    socket.emit('clientData', {room: 'VID_NIU', requestID:requestID, data: requestID});

});
socket.on('serverData', (function(res) {
    return function(data) {
        socket.disconnect();
        res.send('data_'+requestID);
    }  
})(res));

