/* ---  This cron is to upload video to a aws standard object space.  */

var path = require('path');
var env = {root_path:path.join(__dirname, '../../..')};
env.sites_path = env.root_path + '/sites';
env.site_path = env.root_path + '/sites/master';
env.config_path = '/var/qalet_config';

var config = require(env.config_path + '/config.json');

/* -------------*/
delete require.cache[env.site_path + '/api/inc/socketNodeClient/socketNodeClient.js'];
var socketNodeClient = require(env.site_path + '/api/inc/socketNodeClient/socketNodeClient.js');
var socketClient = new socketNodeClient('https://' + config.root + '/');

socketClient.sendToRoom(
    'VID_NIU',
    {x:new Date(), Y:89},
    function(data) {
	// res.send(data);
    }
);
/* -------------*/

let pkg = {
    	mysql		: require(env.site_path + '/api/inc/mysql/node_modules/mysql'),
    	crowdProcess	: require(env.root_path + '/package/crowdProcess/crowdProcess'),
	request		: require(env.root_path + '/package/request/node_modules/request'),
	exec		: require('child_process').exec,
	fs 		: require('fs')
}; 
var config = require(env.config_path + '/config.json'),
    cfg0 = config.db;

let tm = new Date().getTime();
delete require.cache[env.sites_path + '/master/api/inc/awsS3Video/inc_moduleS3.js'];
var moduleS3 = require(env.sites_path + '/master/api/inc/awsS3Video/inc_moduleS3.js');
var objS3 = new moduleS3(config, env, pkg, tm);
objS3.init();

let CP = new pkg.crowdProcess(),
    _f = {};
_f['getBuckets'] = function(cbk) {
	objS3.getBuckets(function(list) {
		console.log('list---->');
		console.log(list);
		cbk({tm : new Date().getTime() - tm, data:list});
	});
}
_f['updateBucket'] = function(cbk) {
	objS3.updateBucket(function(list) {
		cbk(list);
	});
}
CP.serial(
	_f,
	function(result) {	
		console.log(result);
	},
	55000
);

/* --- code for cron watch ---*/
delete require.cache[__dirname + '/watch_cron.inc.js'];
let watch_cron_inc = require(__dirname + '/watch_cron.inc.js'),
    watchCron = new watch_cron_inc(__filename);
watchCron.load('master', 60);
