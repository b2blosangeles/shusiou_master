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
(function(){
    var path = require('path');
    var env = {root_path:path.join(__dirname, '../../..')};
    env.site_path = env.root_path + '/sites/master';
    var request =  require(env.root_path + '/package/request/node_modules/request');
    var fs = require('fs');

    fs.readFile('/var/.qalet_cron_watch.data', 'utf8', function(err,data) {
      if (err){
          fs.writeFile('/var/.qalet_cron_watch.data', JSON.stringify({}), function (err) {});
      } else {
        var watch = {};
        try { watch = JSON.parse(data);} catch (e) {}
	  watch.master_video_split_to_space = {scheduled:60, mark:new Date()};		
          fs.writeFile('/var/.qalet_cron_watch.data', JSON.stringify(watch), function (err) {
              console.log(watch);
          });
      }
    });	
})();
