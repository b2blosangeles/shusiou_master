var path = require('path');
var env = {root_path:path.join(__dirname, '../../..')};
env.site_path = env.root_path + '/sites/master';
env.config_path = '/var/qalet_config';
var config = require(env.config_path + '/config.json');

let pkg = {
    crowdProcess	: require(env.root_path + '/package/crowdProcess/crowdProcess'),
	request		: require(env.root_path + '/package/request/node_modules/request'),
	exec		: require('child_process').exec,
	fs 		: require('fs')
}; 

var WHOAMI = require(env.site_path + '/api/inc/whoami/whoami.js');
let whoami = new  WHOAMI(pkg);
whoami.getIP(
    function(ip) {
	diskspace.check('/', function (err, space) {
	    space.total = Math.round(space.total * 0.000001);
	    space.free = Math.round(space.free * 0.000001);
	    space.used = Math.round(space.used * 0.000001); 
	    space.free_rate =  Math.floor(space.free  * 100 /  space.total); 
	    request({
	      url: 'http://' + config.root + '/api/add_node.api',
	      headers: {
		"content-type": "application/json"
	      },
	      form:{ip : ip, space : space, server_type : 'master'}
	    }, function (error, resp, body) { 
		    console.log('Procecssed master ip ' + ip);
	    });
	});
    }
);
                     
var request =  require(env.root_path + '/package/request/node_modules/request');
var diskspace = require(env.root_path + '/package/diskspace/node_modules/diskspace');


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


/* --- code for monitor root ---*/
(function(){
    var path = require('path');
    var env = {root_path:path.join(__dirname, '../../..')};
    var request =  require(env.root_path + '/package/request/node_modules/request');
    function randomInt(min,max) {
        return Math.floor(Math.random()*(max-min+1)+min);
    }
    var delay = randomInt(0,300) * 10;
    setTimeout(
      function() {
          request({
            url: 'http://' + config.root  + '/api/cron_watch.api',
            headers: {
              "content-type": "application/json"
            },
            form:{}
          }, function (error, resp, body) { 
            console.log(delay + '--' + body);
          });
      }, delay
    );
})();

