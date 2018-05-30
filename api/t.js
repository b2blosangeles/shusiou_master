res.send(__dirname);
return true;

var io = require('/var/qalet/sites/master/api/inc/socket.io-client/node_modules/socket.io-client');
let socket = io.connect("https://dev.shusiou.win/", {secure: true, reconnect: true, rejectUnauthorized : false});
socket.on('connect', function(err, a){
    socket.emit('createRoom', 'VID_NIU');
    socket.emit('clientData', {room: 'VID_NIU', data: 'reloadvideos'});
    socket.on('serverMessage', function(data) {
        console.log(data);
    }); 
    socket.on('clientData', function(data) {
         console.log('---2---');
        console.log(data);
        socket.disconnect();
    });      
});


