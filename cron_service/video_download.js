let tm = new Date().getTime();

function s() {
	let delta_time0 = new Date().getTime() - tm;
	console.log('---- load at ----> ' +  delta_time0);	
	
	var path = require('path'), env = {root_path:path.join(__dirname, '../../..')};
	env.site_path = env.root_path + '/sites/master';
	env.config_path = '/var/qalet_config';
	var config = require(env.config_path + '/config.json');
	var video_folder = '/var/shusiou_video/';

/* -------------*/
delete require.cache[env.site_path + '/api/inc/socketNodeClient/socketNodeClient.js'];
var socketNodeClient = require(env.site_path + '/api/inc/socketNodeClient/socketNodeClient.js');
var socketClient = new socketNodeClient('https://' + config.root + '/');

socketClient.sendToRoom(
    'VID_NIU',
    {x:new Date(), Y:90},
    function(data) {
	// res.send(data);
    }
);
/* -------------*/	
	
	
	let ytdl = require(env.site_path + '/api/inc/ytdl-core/node_modules/ytdl-core'),
	    mysql = require(env.site_path + '/api/inc/mysql/node_modules/mysql'),
	    crowdProcess =  require(env.root_path + '/package/crowdProcess/crowdProcess'),
	    fs = require('fs'),
	    folderP = require(env.site_path + '/api/inc/folderP/folderP'),
	    cfg0 = config.db,
	    CP = new crowdProcess(), 
	    _f = {};

	_f['IP'] = function(cbk) { /* --- get server IP --- */
		function getServerIP() {
			var ifaces = require('os').networkInterfaces(), address=[];
			for (var dev in ifaces) {
				var v =  ifaces[dev].filter((details) => details.family === 'IPv4' && details.internal === false);
				for (var i=0; i < v.length; i++) address[address.length] = v[i].address;
			}
			return address;
		};
		var ips = getServerIP();
	    fs.readFile('/var/.qalet_whoami.data', 'utf8', function(err,data) {
			if ((data) && ips.indexOf(data) != -1) { cbk(data);
			} else { cbk(false); CP.exit = 1; }
	    });	 
	};


	_f['write_download_failure'] = function(cbk) {
		var connection = mysql.createConnection(cfg0);
		connection.connect();
		var message = '';
		var str = 'INSERT INTO `download_failure` ' +
		    '(`vid`, `source`, `code`, `video_info`, `message`) '+
		    'SELECT `vid`, `source`, `code`, `info`, "Over 1 minute time limutation" FROM `download_queue` '+
		    ' WHERE `status` = 9';

		connection.query(str, function (error, results, fields) {
			connection.end();
			if (error) {
				cbk(false);
			} else {
				cbk(results.affectedRows);
			}
		});  
	};	
	_f['DELETE_download_queue'] = function(cbk) { /* --- clean overtime --- */
		var connection = mysql.createConnection(cfg0);
		connection.connect();
		var str = 'DELETE FROM `download_queue` WHERE `status` = 9';
		connection.query(str, function (error, results, fields) {
			connection.end(); cbk(false);
		});  
	};
	_f['mark_download_queue'] = function(cbk) { /* --- mark overtime --- */
		var connection = mysql.createConnection(cfg0);
		connection.connect();
		var str = 'UPDATE `download_queue` SET `status` = 9 WHERE `holder_ip` = "' +  CP.data.IP + '" AND `status` = 1';
		connection.query(str, function (error, results, fields) {
			connection.end(); cbk(false);
		});  
	};

	_f['start_one_from_download_queue'] = function(cbk) { /* --- pickup one from queue --- */
		var connection = mysql.createConnection(cfg0);
		connection.connect();
		var str = 'UPDATE  download_queue SET `holder_ip` = "' + CP.data.IP + '", `status` = 1 ' + 
			' WHERE  `status` = 0 AND (`holder_ip` = "" OR `holder_ip` IS NULL) ORDER BY `created` ASC LIMIT 1';

		connection.query(str, function (error, results, fields) {
			connection.end();
			if ((results) && (results.affectedRows)) {
				cbk(results.affectedRows);
			} else {
				cbk(false); CP.exit = 1;
			}
		});  
	};
	_f['current'] = function(cbk) { /* --- get the one from queue --- */
		var connection = mysql.createConnection(cfg0);
		connection.connect();
		var str = 'SELECT * FROM `download_queue` WHERE `holder_ip` = "' + CP.data.IP + '" AND `status` = 1';
		connection.query(str, function (error, results, fields) {
			connection.end();
			if (results.length) {
				cbk(results[0]);
			} else {
				cbk(false); CP.exit = 1;
			}
		});  
	};
	_f['DIR'] = function(cbk) { /* create video path */
		fp = new folderP();
		fp.build(video_folder + CP.data.current.vid + '/video/', () => {
			fp.build(video_folder + CP.data.current.vid + '/images/' , () => {
				fp.build(video_folder + CP.data.current.vid + '/sections/' , () => {
					cbk({
						video : video_folder + CP.data.current.vid + '/video/',
						images : video_folder + CP.data.current.vid + '/images/',
						sections : video_folder + CP.data.current.vid + '/sections/'
					});
				});
			});		
		});
	};
	_f['downlod_video'] = function(cbk) {  /* downlod video */
		var url = decodeURIComponent(CP.data.current.code);
		var video = ytdl(url, {quality:'highest'}, function(err) { });
		video.pipe(fs.createWriteStream(CP.data.DIR.video +'video.mp4'));	

		video.on('data', function(info) {}); 
		video.on('end', function(info) {
			cbk(CP.data.current.code);
		});
		video.on('error', function(info) {
			CP.exit = 1;
			cbk('ERR: CP.data.current.code');
		});	
	};

	_f['verifyFormat'] = function(cbk) {
		var childProcess = require('child_process');
		var f_video = CP.data.DIR.video +'video.mp4';
		var AD = {start:30, length:30};
		var fn = CP.data.DIR.sections  + AD.start + '_' + AD.length + '.mp4';
		let s = 'ffmpeg -i ' + f_video + ' -ss '+ AD.start + '  -t ' + AD.length + ' -c copy ' + fn + ' -y ';
		var ls = childProcess.exec(s, function (error, stdout, stderr) {
				fs.stat(fn, function(err, stat) {
				  if(!err && (stat.size)) cbk(true); 
				  else cbk(false); 		  
				});	
			});	
	};

	_f['conclution'] = function(cbk) {
		var connection = mysql.createConnection(cfg0);
		connection.connect();
		var info = (CP.data.current.info)?CP.data.current.info:'';
		var json_info = {};
		try { json_info = JSON.parse(info); } catch (e) {}
		if (CP.data.verifyFormat) {
			var str = 'INSERT INTO `video` ' +
			    '(`source`, `code`, `server_ip`, `video_info`, `vid`, `video_length`, `org_thumbnail`, `uploaded`) VALUES (' +
			    "'" + CP.data.current.source + "'," +
			    "'" + CP.data.current.code.replace(/\'/g, "\\\'") + "'," +
			    "'" + CP.data.current.holder_ip + "'," +
			    "'" + info.replace(/\'/g, "\\\'") + "'," +
			    "'" + CP.data.current.vid + "'," +
			    "'" +  CP.data.current.video_length + "'," +
			    "'" +  CP.data.current.org_thumbnail + "'," +
			    'NOW())';
		} else {
			var str = 'INSERT INTO `download_failure` ' +
			    '(`vid`,`source`, `code`, `video_info`, `message`) VALUES (' +
			    "'" + CP.data.current.vid + "'," +
			    "'" + CP.data.current.source + "'," +
			    "'" + CP.data.current.code.replace(/\'/g, "\\\'") + "'," +
			    "'" + info.replace(/\'/g, "\\\'") + "'," +
			    "'Wrong video format!')";

		}
		connection.query(str, function (error, results, fields) {
			connection.end();
			if (error) {
				cbk(str);
			} else {
				if (results.affectedRows) {
					cbk(true);
				} else {
					cbk(false);
				}

			}
		});  
	};
	_f['clean_download_queue'] = function(cbk) {
		var connection = mysql.createConnection(cfg0);
		connection.connect();
		var str = 'DELETE FROM `download_queue`  WHERE `id` = "' + CP.data.current.id + '"';
		connection.query(str, function (error, results, fields) {
			connection.end();
			cbk(true);
		});  
	};
	CP.serial(_f,
		function(data) {
			let delta_time = new Date().getTime() - tm;
			console.log(data);
			if (delta_time < 50000 && (CP.data.current)) {
				s();
			} else {
				process.exit(-1);
			}	
		},
		53000
	);
}
s();

/* --- code for cron watch ---*/
delete require.cache[__dirname + '/watch_cron.inc.js'];
let watch_cron_inc = require(__dirname + '/watch_cron.inc.js'),
    watchCron = new watch_cron_inc(__filename);
watchCron.load('master', 60);
