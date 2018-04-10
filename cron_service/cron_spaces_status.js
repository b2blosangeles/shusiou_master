/* ---  This cron is to upload video to a aws standard object space.  */

var path = require('path');
var env = {root_path:path.join(__dirname, '../../..')};
env.sites_path = env.root_path + '/sites';
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
