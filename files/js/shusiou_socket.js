var socket = io.connect('/');
socket.emit('createRoom', 'testroom'); 
socket.on('serverData', function(data) {
  console.log(data);
});
