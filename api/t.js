delete require.cache[env.site_path + '/api/inc/socketNodeClient/socketNodeClient.js'];
let socketNodeClient = require(env.site_path + '/api/inc/socketNodeClient/socketNodeClient.js');

var config = require(env.config_path + '/config.json');
let socketClient = new socketNodeClient('https://' + config.root + '/');

socketClient.sendToRoom(
    ['room1', 'room2'],
    env,
    function(data) {
        res.send(data);
    }
);
