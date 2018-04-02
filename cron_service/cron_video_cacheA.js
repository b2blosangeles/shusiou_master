/* ---  This cron is to appoint node for video. add record link only */
/* ---  chennel only related with user video, not related with video only */
var path = require('path');
var env = {root_path:path.join(__dirname, '../..')};
env.site_path = env.root_path + '/site';
env.site_path = env.root_path + '/site';
env.config_path = '/var/qalet_config';

var config = require(env.config_path + '/config.json');

var default_cnt = 2;

var mysql = require(env.site_path + '/api/inc/mysql/node_modules/mysql'),
    crowdProcess =  require(env.root_path + '/package/crowdProcess/crowdProcess'),
    cfg0 = config.db,
    fs = require('fs');


var CP_s = new crowdProcess();
var _f_s = {};		
_f_s['need_remove']  = function(cbk_s) { /* get database catched local videos */
	var connection = mysql.createConnection(cfg0);
	connection.connect();
	var str = 'SELECT * FROM `video_user` WHERE 1';
	
	connection.query(str, function (error, results, fields) {
		connection.end();
		if (error || !results.length) {
			cbk_s(false);
		} else {
			cbk_s(results);
		}	
	});
};


CP_s.serial(
	_f_s,
	function(data_s) {
		console.log(JSON.stringify(data_s));
	},
	10000
);

