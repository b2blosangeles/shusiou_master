var io = require('/var/qalet/sites/master/api/inc/socket.io-client/node_modules/socket.io-client');
let socket = io.connect("https://dev.shusiou.win/", {secure: true, reconnect: true, rejectUnauthorized : false});
socket.on('connect', function(){
    socket.emit('createRoom', 'VID_NIU');
    socket.emit('clientData', {room: 'VID_NIU', data: 'reloadvideos'});
    socket.on('serverData', function(data) {
        res.send(data);
        socket.disconnect();
    });
});


