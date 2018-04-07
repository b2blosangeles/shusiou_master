var mysql = require(env.site_path + '/api/inc/mysql/node_modules/mysql'),
    config = require(env.config_path + '/config.json'),
    cfg0 = config.db;

pkg.mysql = mysql;

let tm = new Date().getTime();
delete require.cache[env.sites_path + '/master/api/inc/awsS3Video/inc_moduleS3.js'];
var moduleS3 = require(env.sites_path + '/master/api/inc/awsS3Video/inc_moduleS3.js');
var objS3 = new moduleS3(config, env, pkg);
objS3.init();	
objS3.getBuckets(function(list) {
	res.send({tm : new Date().getTime() - tm, data:list});
});
