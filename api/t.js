var io = require('/var/qalet/sites/master/api/inc/socket.io-client/node_modules/socket.io-client');
let socket = io.connect("https://dev.shusiou.win/", {secure: true, reconnect: true, rejectUnauthorized : false});
socket.on('connect', function(err, a){
    console.log('---err---');
    console.log(err);
    console.log('---a---');
    console.log(a);
    socket.emit('createRoom', 'VID_NIU');
});
socket.on('serverMessage', function(data) {
     console.log('---2---');
    console.log(data);
});

