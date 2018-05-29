// var io = require(env.site_path + '/api/inc/socket.io-client/node_modules/socket.io-client');

//let ioClient = io.connect("https://dev.shusiou.win/");
//ioClient.emit('createRoom', 'VID_NIU'); 

// ioClient.emit('clientData', {room: 'VID_NIU', data: 'niu BB'});

// var socket = io("https://dev.shusiou.win/");
var io = require('/var/qalet/sites/master/api/inc/socket.io-client/node_modules/socket.io-client')('https://dev.shusiou.win');
let socket = io.connect("https://dev.shusiou.win/");
socket.on('connect', function(err){
    console.log('---1---');
});
socket.on('serverMessage', function(data) {
     console.log('---2---');
    console.log(data);
});
 console.log('---3---');
socket.emit('createRoom', 'VID_NIU');
