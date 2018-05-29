var io = require(env.site_path + '/api/inc/socket.io-client/node_modules/socket.io-client');
let ioClient = io.connect("http://localhost:8000");
res.send(env);
