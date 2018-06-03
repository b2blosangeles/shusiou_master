(function () { 
	var obj =  function (config, env, pkg, tm) {
		this.getSpaceId = function(space) {
			let patt = /https\:\/\/([^.]+)\./ig;
			let r = patt.exec(space);
			return r[1];
		}
		this.delete = function(delete_callback) {
			let me = this;
			var connection = pkg.mysql.createConnection(config.db);
			connection.connect();
			var str = 'SELECT * FRom `video_space` WHERE `vid` NOT IN (SELECT `vid` FROM `video_user` WHERE 1)';

			connection.query(str, function (error, results, fields) {
				connection.end();
				if (error || !results.length) {
					delete_callback('finished');
				} else {
					me.removeVidFromSpace(results[0], delete_callback); 
				}	
			});			
			return true;
		}	
		this.removeVidFromSpace = function(rec, cbk) {
			let me = this;
			let space_dir = 'videos/' + rec.vid;
			var params = { 
				Bucket: me.getSpaceId(rec.space),
				Delimiter: '',
				MaxKeys : 300,
				Marker : '',
				Prefix: space_dir
			}, v = [];

			me.s3.listObjects(params, function (err, data) {
				if(err) {
					cbk({err:err.message});
					return true;
				} else {	
					if (!data.Contents.length) {
						me.cleanVideoRec(rec.vid, cbk);
					} else {
						for (var i = 0; i < data.Contents.length; i++) {
							v.push({Key :  data.Contents[i].Key})
						}
						me.removeObjects(rec.space, rec.vid, v, cbk);
					}
				}
			});	
			return true;
		}
		this.cleanVideoRec = function(vid, cbk) {
			let me = this;
			if (vid) {
				let cfgmdb = JSON.parse(JSON.stringify(config.db));
				cfgmdb.multipleStatements = true;
				var connection = pkg.mysql.createConnection(cfgmdb);
				connection.connect();
				var str = "DELETE FROM  `video`  WHERE `vid` = '" + vid + "'; DELETE FROM  `video_space`  WHERE `vid` = '" + vid + "'";
				connection.query(str, function (error, results, fields) {
					connection.end();
					cbk(results) 
				});
			} else {
				cbk(false);
			}
		}				
			
		this.init = function() {
			let me = this;
			const AWS = require(env.site_path + '/api/inc/aws-sdk/node_modules/aws-sdk')
			me.s3 = new AWS.S3({
			    httpOptions: {timeout: 50000},		
			    endpoint: new AWS.Endpoint(config.objectSpace.endpoint),
			    accessKeyId: config.objectSpace.accessKeyId,
			    secretAccessKey: config.objectSpace.secretAccessKey
			});
			me.listAllSpaceVideos();

		}
	
		this.listAllSpaceVideos = function(rec) {
			let me = this;
			let space_dir = 'videos/';
			var params = { 
				Bucket: 'shusiouwin-dev-1',
				Delimiter: '/',
				MaxKeys : 300,
				Marker : '',
				Prefix: space_dir
			}, v = [];

			me.s3.listObjects(params, function (err, data) {
				if(err) {
					cbk({err:err.message});
					return true;
				} else {	
					if (!data.Contents.length) {
						console.log('empty lll');
					} else {
						for (var i = 0; i < data.Contents.length; i++) {
							v.push({Key :  data.Contents[i].Key})
						}
						console.log(v);
					}
				}
			});	
			return true;
		}		
		
		this.removeObjects = function(space, vid, list, callback) {
			let me = this;
			var params = {
				Bucket:  me.getSpaceId(space),
				Delete: {Objects:list}
			};
			me.s3.deleteObjects(params, function(err, d) {
				if (err) callback({status:'error', message:'unable to remove ' + vid + ' Objects'});
				else callback({status:'success', message:'removed ' +d.Deleted.length + ' Objects'});
			});
		}
		
		this.init();
	};
	module.exports = obj;
})();
