delete require.cache[env.site_path + '/api/inc/socketNodeClient/socketNodeClient.js'];
let socketNodeClient = require(env.site_path + '/api/inc/socketNodeClient/socketNodeClient.js');

let socketClient = new socketNodeClient('https://dev.shusiou.win/');

socketClient.sendToRoom(
    'VID_NIU',
    {x:1234},
    function(data) {
        res.send(data);
    }
);

return true;
/*
var io = require(env.sites_path + '/api/inc/socket.io-client/node_modules/socket.io-client');
let socket = io.connect("https://dev.shusiou.win/", {secure: true, reconnect: true, rejectUnauthorized : false});
let room = 'VID_NIU', requestID = room + '_' + new Date().getTime();

socket.on('connect', function(){
    socket.emit('createRoom', room);
    setTimeout(function() {
        socket.emit('clientData', {room: room, data: { requestID:requestID, data: 'requestID'}});
    });
});
    
    socket.on('serverData', (function(res, requestID) {
        return function(data) {
            if ((data.data) && data.data.requestID === requestID) {
                socket.disconnect();
                res.send(requestID + '---' + data.data.requestID);
            }
        }  
    })(res, requestID));
*/
