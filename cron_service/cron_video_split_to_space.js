/* ---  This cron is to upload video to a aws standard object space.  */
var path = require('path');
var env = {root_path:path.join(__dirname, '../../..')};
env.site_path = env.root_path + '/sites/master';
env.config_path = '/var/qalet_config';

var config = require(env.config_path + '/config.json');

/* -------------*/
delete require.cache[env.site_path + '/api/inc/socketNodeClient/socketNodeClient.js'];
var socketNodeClient = require(env.site_path + '/api/inc/socketNodeClient/socketNodeClient.js');
var socketClient = new socketNodeClient('https://' + config.root + '/', env);

socketClient.sendToRoom(
    'CRON_REPORT',
    {x:new Date(), Y:98},
    function(data) {
	// res.send(data);
    }
);
/* ------------- */

let pkg = {
    	mysql		: require(env.site_path + '/api/inc/mysql/node_modules/mysql'),
    	crowdProcess	: require(env.root_path + '/package/crowdProcess/crowdProcess'),
	request		: require(env.root_path + '/package/request/node_modules/request'),
	exec		: require('child_process').exec,
	fs 		: require('fs')
}; 

let awsS3Video = require(env.site_path + '/api/inc/awsS3Video/awsS3Video.js');
let tm = new Date().getTime();

function s() {
	return true;
	let delta_time0 = new Date().getTime() - tm;
	console.log('---- load at ----> ' +  delta_time0);
	var splitVideo = new awsS3Video(config, env, pkg, tm);	
	splitVideo.load(function(data) {
		let delta_time = new Date().getTime() - tm;
		console.log(data);
		if (delta_time < 50000 && data !== 'No new id at all') {
				//delete require.cache[env.site_path + '/api/inc/socketNodeClient/socketNodeClient.js'];
				//var socketNodeClient = require(env.site_path + '/api/inc/socketNodeClient/socketNodeClient.js');
				// var socketClient = new socketNodeClient('https://' + config.root + '/');
				/*
				socketClient.sendToRoom(
				    'VID_NIU',
				    {x:new Date(), Y:6},
				    function(data) {
					// res.send(data);
				    }
				);*/			
			s();
		} else {
			console.log('---- stopped ----> ');
				//delete require.cache[env.site_path + '/api/inc/socketNodeClient/socketNodeClient.js'];
				//var socketNodeClient = require(env.site_path + '/api/inc/socketNodeClient/socketNodeClient.js');
				//var socketClient = new socketNodeClient('https://' + config.root + '/');
				/*
				socketClient.sendToRoom(
				    'VID_NIU',
				    {x:new Date(), Y:1},
				    function(data) {
					// res.send(data);
				    }
				);
				*/
			process.exit(-1);
			return true;
		}
		
	});
}
s();

//delete require.cache[env.site_path + '/api/inc/socketNodeClient/socketNodeClient.js'];
//var socketNodeClient = require(env.site_path + '/api/inc/socketNodeClient/socketNodeClient.js');
//var socketClient = new socketNodeClient('https://' + config.root + '/');
/*
socketClient.sendToRoom(
    'VID_NIU',
    {x:new Date()},
    function(data) {
      //  res.send(data);
    }
);
*/
/* --- code for cron watch ---*/
delete require.cache[__dirname + '/watch_cron.inc.js'];
let watch_cron_inc = require(__dirname + '/watch_cron.inc.js'),
    watchCron = new watch_cron_inc(__filename);
watchCron.load('master', 60);
