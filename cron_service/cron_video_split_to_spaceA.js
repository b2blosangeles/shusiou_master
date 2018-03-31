/* ---  This cron is to upload video to a aws standard object space.  */

var path = require('path');
var env = {root_path:path.join(__dirname, '../../..')};
env.site_path = env.root_path + '/sites/master';
env.config_path = '/var/qalet_config';

var config = require(env.config_path + '/config.json');

let pkg = {
    	mysql		: require(env.site_path + '/api/inc/mysql/node_modules/mysql'),
    	crowdProcess	: require(env.root_path + '/package/crowdProcess/crowdProcess'),
	request		: require(env.root_path + '/package/request/node_modules/request'),
	exec		: require('child_process').exec,
	fs 		: require('fs')
}; 

let awsS3Video = require(env.site_path + '/api/inc/awsS3Video/awsS3Video.js');
let tm = new Date().getTime(),
    CP_0 = new pkg.crowdProcess(), 
    _f0 = {};

_f0['S1'] = function(load_callback) {
	var splitVideo = new awsS3Video(config, env, pkg, tm);	
	splitVideo.load(function(data) {
		let delta_time = new Date().getTime() - tm;
		console.log('----load_callback----');
		if (delta_time > 50000) {
			CP_0.exit = 1;
		}		
		load_callback(data)
	});
}
_f0['S2'] = function(load_callback) {
	var splitVideo = new awsS3Video(config, env, pkg, tm);	
	splitVideo.load(function(data) {
		console.log('----second call----');		
		load_callback(data)
	});
}

CP_0.serial(
	_f0,
	function(results1) {
		console.log(results1.results);
	},
59000);
