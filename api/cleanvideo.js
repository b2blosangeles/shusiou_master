
pkg.mysql	=  require(env.sites_path + '/admin/api/inc/mysql/node_modules/mysql'); 
var config = require(env.config_path + '/config.json'),
    cfg0 = config.db;

delete require.cache[env.sites_path + '/master/api/inc/awsS3Video/awsS3VideoAdmin.js'];
let awsS3VideoAdmin = require(env.sites_path + '/master/api/inc/awsS3Video/awsS3VideoAdmin.js');
 
let tm = new Date().getTime();


var videoAdmin = new awsS3VideoAdmin(config, env, pkg, tm);	
 videoAdmin.delete(function(data) {
	//let delta_time = new Date().getTime() - tm;
	res.send(data);

});

