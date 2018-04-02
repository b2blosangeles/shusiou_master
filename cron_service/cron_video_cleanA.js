var path = require('path'), env = {root_path:path.join(__dirname, '../../..')};

env.site_path = env.root_path + '/sites/master';
env.config_path = '/var/qalet_config';
var config = require(env.config_path + '/config.json');

let mysql = require(env.site_path + '/api/inc/mysql/node_modules/mysql'),
    crowdProcess =  require(env.root_path + '/package/crowdProcess/crowdProcess'),
    fs = require('fs'),
    folderP = require(env.site_path + '/api/inc/folderP/folderP'),
    cfg0 = config.db,
    CP = new crowdProcess(), 
    _f = {};

let environment = config.environment;

console.log(environment); 

_f['need_remove']  = function(cbk_s) { 
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

CP.serial(
	_f,
	function(data_s) {
		console.log(JSON.stringify(data_s));
	},
	10000
);

