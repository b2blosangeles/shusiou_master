delete require.cache[env.site_path + '/api/inc/socketNodeClient/socketNodeClient.js'];
let socketNodeClient = require(env.site_path + '/api/inc/socketNodeClient/socketNodeClient.js');

var config = require(env.config_path + '/config.json');
let socketClient = new socketNodeClient('https://' + config.root + '/');
let rooms = ['room1', 'room2'];
for (let i = 0; i < rooms.length; i++) {
    socketClient.sendToRoom(
        rooms[i],
        env,
        function(data) {
            res.send(data);
        }
    );
}

