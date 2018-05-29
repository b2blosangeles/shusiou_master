var socket = io.connect('/');
socket.emit('createRoom', 'testroom'); 
socket.on('serverData', function(data) {
  console.log(data);
});
setTimeout(
  function() {
    socket.emit('clientData', encodeURIComponent(JSON.stringify({room: 'testroom' , data: 'dcsf.sdf'})));
  }, 3000
);
