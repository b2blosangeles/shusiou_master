/* ---  This cron is to upload video to a aws standard object space.  */
var path = require('path');
var env = {root_path:path.join(__dirname, '../../..')};
env.site_path = env.root_path + '/sites/master';
env.config_path = '/var/qalet_config';

var config = require(env.config_path + '/config.json');

/* --- code for cron watch ---*/
delete require.cache[__dirname + '/watch_cron.inc.js'];
let watch_cron_inc = require(__dirname + '/watch_cron.inc.js'),
    watchCron = new watch_cron_inc(__filename);
watchCron.load('master', 60);
/* --- code for cron watch  ---*/

/* -------------*/
delete require.cache[env.root_path + '/package/socketNodeClient/socketNodeClient.js'];
var socketNodeClient = require(env.root_path + '/package/socketNodeClient/socketNodeClient.js');
var socketClient = new socketNodeClient(
	{link:'https://comm1.service.dev.shusiou.win/'}, 
	env);
socketClient.sendToRoom(
    'CRON_REPORT',
    {x:new Date(), Y:92},
    function(data) {
	// res.send(data);
    }
);
/* ------------- */

var sendToFrontendNotice = function(vid, cbk) {
	var socketNodeClient = require(env.root_path + '/package/socketNodeClient/socketNodeClient.js');
	var socketClient = new socketNodeClient(
		{link:'https://comm1.service.dev.shusiou.win/'}, 
		env);
	// console.log('send message to video_' +  vid);
	socketClient.sendToRoom(
	    'video_' +  vid,
	    {reload:true},
	    function(data) {
		cbk(true);
	    }
	);			
};


let pkg = {
    	mysql		: require(env.site_path + '/api/inc/mysql/node_modules/mysql'),
    	crowdProcess	: require(env.root_path + '/package/crowdProcess/crowdProcess'),
	request		: require(env.root_path + '/package/request/node_modules/request'),
	exec		: require('child_process').exec,
	fs 		: require('fs')
}; 

let awsS3Video = require(env.site_path + '/api/inc/awsS3Video/awsS3Video.js');
let tm = new Date().getTime();

var IN = [];
function s() {
	let delta_time0 = new Date().getTime() - tm;
	// console.log('---- load at ----> ' +  delta_time0);
	var splitVideo = new awsS3Video(IN, config, env, pkg, tm);	
	splitVideo.load(function(data) {
		let delta_time = new Date().getTime() - tm;
		if (delta_time < 40000 && data !== 'No new id at all') {			
			s();
		} else {
			//console.log('*** -IN- ***>');
			//console.log(IN);
			if (IN.length) {
				sendToFrontendNotice(IN[0], function(data) {
					console.log('====this.sendToFrontendNotice(vid)===>' + IN[0]);
					console.log('exit current session');
					process.exit(-1);
					return true;
				});
			} else {
				console.log('exit current session');
				process.exit(-1);
				return true;
			}
			
			
		}
		
	});
}
s();
