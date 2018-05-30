var io = require('/var/qalet/sites/master/api/inc/socket.io-client/node_modules/socket.io-client');
let socket = io.connect("https://dev.shusiou.win/", {secure: true, reconnect: true, rejectUnauthorized : false});
let room = 'VID_NIU', requestID = room + '_' + new Date().getTime();

let res = {send: function(d) { console.log(d);}}

socket.on('connect', function(){
    socket.emit('createRoom', room);
    setTimeout(
        function() {
            socket.emit('clientData', {room: room, data: { requestID:requestID, data: 'requestID'}});
        }, 1000
    )
    socket.on('serverData', (function(res, requestID) {
        return function(data) {
            if ((data.data) && data.data.requestID === requestID) {
                socket.disconnect();
                res.send(requestID + '---' + data.data.requestID);
            }
        }  
    })(res, requestID));
});


