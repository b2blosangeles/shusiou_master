
// pkg.mysql	=  require(env.site_path + '/api/inc/mysql/node_modules/mysql'); 
env.site_path = env.root_path + '/master';
let awsS3VideoAdmin = require(env.site_path + '/api/inc/awsS3Video/awsS3VideoAdmin.js');
let tm = new Date().getTime();


var videoAdmin = new awsS3VideoAdmin(config, env, pkg, tm);	
 videoAdmin.delete(function(data) {
	let delta_time = new Date().getTime() - tm;
	res.send(data);

});

