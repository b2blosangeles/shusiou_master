function jsonToQueryString(o) {
	return JSON.stringify(o).replace(/'/g, "\\'");
};
function queryStringToJSON(s, o) {
	try { o = JSON.parse(s.replace(/\\\'/g, "'")); } catch (e) {}
	return o;
};
var app = function(auth_data) { 
	var mysql = require(env.site_path + '/api/inc/mysql/node_modules/mysql'),
	    config = require(env.config_path + '/config.json'),
	    cfg0 = config.db;
	
	var opt = req.body.cmd;
	var uid = auth_data.uid;
	
	
	 var cfgM = JSON.parse(JSON.stringify(cfg0));
	 cfgM.multipleStatements = true;
	switch(opt) {
		case 'saveSection':
			
			var curriculum_id = req.body.data.curriculum_id,
			    section_id = req.body.data.section_id,
			    tpl = jsonToQueryString(req.body.data.tpl),
			    data =  jsonToQueryString(req.body.data.data),
			    start = req.body.data.data.track.s,
			    end =  req.body.data.data.track.t;
			
			var str = (section_id === 'new') ? 
				'INSERT INTO  `curriculum_section_items` (`curriculum_id`,  `type` ,`tpl`, `data`, `start`, `end`, `created`)' + 
				' VALUES ("' + curriculum_id + '",' +
				'"test",' + "'" + tpl + "'," + "'" + data + "'," + "'" + start + "'," + "'" + end + "', NOW() " +
				' ) ' 
				:	 
				"UPDATE  `curriculum_section_items` SET " + 
				"`type` = 'test8', " +
				"`tpl` = '" + tpl + "', " +
				"`data` = '" + data + "', " +
				"`start` = '" + start + "', " +
				"`end` = '" + end + "', " +
				"`created` = NOW() " + 
				" WHERE `section_id` = '" + section_id + "' AND  `curriculum_id` = '" + curriculum_id + "'";
				
			var connection = mysql.createConnection(cfg0);
			connection.connect();
				connection.query(str, function (error, results, fields) {
				connection.end();
				res.send(results);
			});			
			break			
		case 'deleteSection':
			var curriculum_id = req.body.data.curriculum_id,
			    section_id = req.body.data.section_id;
			
			var str = "DELETE FROM  `curriculum_section_items` " + 
				" WHERE `section_id` = '" + section_id + "' AND  `curriculum_id` = '" + curriculum_id + "'";
				
			var connection = mysql.createConnection(cfg0);
			connection.connect();
				connection.query(str, function (error, results, fields) {
				connection.end();
				res.send(str);
			});			
			break		
		case 'getList':
			var CP = new pkg.crowdProcess();
			var _f = {};
			_f['S1'] = function(cbk) {
				var connection = mysql.createConnection(cfg0);
				connection.connect();
				var str = 'SELECT A.curriculum_id, A.`name`, B.* FROM `curriculums` A LEFT JOIN  `video_space` B  ON A.vid = B.vid '+
				    ' WHERE A.uid = "' + uid + '";';

				connection.query(str, function (error, results, fields) {
					connection.end();
					if (error) {
						cbk(error.message);
						return true;
					} else {
						cbk(results);
					}
				});  
			};			
			CP.serial(
				_f,
				function(data) {
					var d = [];
					for (var i=0; i <  CP.data.S1.length; i++) {
						d.push(CP.data.S1[i]);
					}
					res.send({_spent_time:data._spent_time, status:data.status, data:d});
				},
				3000
			);
			break;				
		case 'add':
			var CP = new pkg.crowdProcess();
			var _f = {};
			_f['A0'] = function(cbk) {  
				var connection = mysql.createConnection(cfgM);
				connection.connect();
				var tm = Math.floor((new Date().getTime()- new Date('2017-12-01').getTime()) * 0.001 / 60) * 10000000000;
				
				var str = 'INSERT INTO  `curriculums` (`curriculum_id`, `uid`,`vid`,`name`,`mother_lang`,`learning_lang`,`level`, `created`) '+
				' VALUES (' + '"' + tm + '",' +
				'"' + uid + '",' +
				'"' + req.body.vid + '",' +
				'"' + req.body.name + '",' +
				'"' + req.body.mother_lang  + '",' +
				'"' + req.body.learning_lang  + '",' +
				'"' + req.body.level  + '",' +
				'NOW()); ' +
				'UPDATE  curriculums SET `curriculum_id` = ' + tm + ' + `id` WHERE `curriculum_id` = "' + 
				  tm + '" AND `uid` = "' + uid + '"';   
				connection.query(str, function (error, results, fields) {
					connection.end();
					if (error)  cbk(false);
					else if (results) { 
						cbk(results);
					} else cbk(false);
				});  
			};	
			CP.serial(
				_f,
				function(data) {
					res.send({_spent_time:data._spent_time, status:data.status, curriculum: data.results});
				},
				3000
			);
			break;	
		case 'update':
			var CP = new pkg.crowdProcess();
			
			var _f = {};
			_f['S1'] = function(cbk) {
				var str = 'UPDATE  `curriculums` SET ' +
				'`name` = "' + req.body.name + '",' +
				'`published` = "' + ((req.body.published)?req.body.published:0) + '",' +    
				'`created` = NOW() ' +
				'WHERE `curriculum_id` ="' + req.body.curriculum_id + '"; ';
				var connection = mysql.createConnection(cfg0);
				connection.connect();
				connection.query(str, function (error, results, fields) {
					connection.end();
					if (error) {
						cbk(error.message);
						return true;
					} else {
						if (results[0]) {
							cbk(results[0]);
						} else {
							cbk(false);
						}

					}
				});  
			};
			CP.serial(
				_f,
				function(data) {
					
					res.send({_spent_time:data._spent_time, status:data.status, data:data});
				},
				30000
			);
			break;			
		case 'delete':
			var CP = new pkg.crowdProcess();
			var _f = {};
			_f['A0'] = function(cbk) {  
				var connection = mysql.createConnection(cfgM);
				connection.connect();
				var curriculum_id = req.body.curriculum_id;
				var str = 'DELETE FROM `curriculums` WHERE `curriculum_id` = "' + curriculum_id + '" AND `uid` = "' + uid + '"';   
				connection.query(str, function (error, results, fields) {
					connection.end();
					if (error)  cbk(false);
					else if (results) { 
						cbk(results);
					} else cbk(false);
				});  
			};	
			CP.serial(
				_f,
				function(data) {
					res.send({_spent_time:data._spent_time, status:data.status, curriculum: data.results});
				},
				3000
			);
			break;	
		case 'getCurriculumById':
			var CP = new pkg.crowdProcess();
			var _f = {};
			var curriculum_id = req.body.curriculum_id;
			_f['S0'] = function(cbk) {
				var connection = mysql.createConnection(cfg0);
				connection.connect();
				var str = 'SELECT A.*, B.*, S.`space` FROM `curriculums` A LEFT JOIN  `video` B  ON A.vid = B.vid '+
				    ' LEFT JOIN  `video_space` S  ON A.vid = S.vid ' +
				    ' WHERE A.curriculum_id = "' + curriculum_id + '" AND  A.uid = "' + uid + '";';

				connection.query(str, function (error, results, fields) {
					connection.end();
					if (error) {
						cbk(error.message);
						return true;
					} else {
						cbk(results[0]);
					}
				});  
			};
			_f['S1'] = function(cbk) {
				var connection = mysql.createConnection(cfg0);
				connection.connect();
				var str = 'SELECT * FROM `curriculum_section_items`' +
				    ' WHERE `curriculum_id` = "' + curriculum_id + '";';

				connection.query(str, function (error, results, fields) {
					connection.end();
					if (error) {
						cbk([]);
						return true;
					} else {
						for (var i = 0; i < results.length; i++) {
							results[i].data = JSON.parse(results[i].data);
							results[i].tpl = JSON.parse(results[i].tpl);
						}
						cbk(results);
					}
				});  
			};			
			CP.serial(
				_f,
				function(data) {
					CP.data.S0.sections = [];
					try {
						CP.data.S0.sections = (CP.data.S1) ? CP.data.S1 : [];
					} catch (err) {}	
					res.send({_spent_time:data._spent_time, status:data.status, data:CP.data.S0});
				},
				3000
			);
			break;				
		default:
			res.send({status:'error', message:'Wrong opt value!'});
	}
};

delete require.cache[env.site_path + '/api/inc/auth/auth.js'];
var AUTH = require(env.site_path + '/api/inc/auth/auth.js'),
    auth = new AUTH(env, pkg, req);

auth.getUid(function(auth_data) {
	if (!auth_data.isAuth || !auth_data.uid) {
		res.send({status:'failure', message:'Auth failure'});
	} else {	
		app(auth_data);
	}
});
