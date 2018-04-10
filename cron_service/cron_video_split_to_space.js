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
let tm = new Date().getTime();

function s() {
	let delta_time0 = new Date().getTime() - tm;
	console.log('---- load at ----> ' +  delta_time0);
	var splitVideo = new awsS3Video(config, env, pkg, tm);	
	splitVideo.load(function(data) {
		let delta_time = new Date().getTime() - tm;
		console.log(data);
		if (delta_time < 50000 && data !== 'No new id at all') {
			s();
		} else {
			console.log('---- stopped ----> ');
			process.exit(-1);
			return true;
		}
		
	});
}
s();

/* --- code for cron watch ---*/
(function(tp, scheduled){
    var path = require('path'),
	watch_file = '/var/.qalet_cron_watch.data';
	env = {root_path:path.join(__dirname, '../../..')},
	fn_a = /\/([^\/]+)$/i.exec(__filename),
	cron_data = require(env.root_path + '/sites/' + tp + '/cron_service/cron.json');
	
	var script_name = '';
	for (var i = 0; i < cron_data.length; i++) {
		if ( cron_data[i].script == fn_a[1]) {
			script_name = fn_a[1];
		}
	}
	
    var request =  require(env.root_path + '/package/request/node_modules/request');
    var fs = require('fs');

	fs.readFile(watch_file, 'utf8', function(err,data) {
		if (err){
			fs.writeFile(watch_file, JSON.stringify({}), function (err) {});
		} else {
			var watch = {};
			try { watch = JSON.parse(data);} catch (e) {}
			
			let start = ((watch[tp + '_'+ fn_a[1]]) && (watch[tp + '_'+ fn_a[1]].mark)) ? watch[tp + '_'+ fn_a[1]].mark : null;
			
			if (script_name) {
				watch[tp + '_'+ script_name] = {scheduled:scheduled, start: start, mark:new Date()};
			} else {
				delete watch[tp + '_'+ fn_a[1]];
			}
			fs.writeFile(watch_file, JSON.stringify(watch), function (err) {
				console.log(watch);
			});
		}
	});	
})('master', 60);
