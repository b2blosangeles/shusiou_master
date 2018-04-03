(function () { 
	var obj =  function (config, env, pkg, tm) {
		
		let _space = { 
			space_id : 'shusiou-d-01',
			space_url :'https://shusiou-d-01.nyc3.digitaloceanspaces.com/'
		};	
		this.delete = function(delete_callback) {
			let me = this;
			var connection = pkg.mysql.createConnection(config.db);
			connection.connect();
			var str = 'SELECT * FRom `video_space` WHERE `vid` NOT IN (SELECT `vid` FROM `video_user` WHERE 1)';

			connection.query(str, function (error, results, fields) {
				connection.end();
				if (error || !results.length) {
					delete_callback(false);
				} else {
					me.removeVidFromSpace(results[0], delete_callback); 
				}	
			});			
			return true;
		}	
		this.removeVidFromSpace = function(rec, cbk) {
			let space_dir = 'shusiou_' + config.environment  + '/' + rec.vid;
			
			let me = this;
			var params = { 
				Bucket: _space.space_id,
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
						me.removeObjects(data.Contents, cbk);
					}
				}
			});	
			return true;
		}
		this.cleanVideoRec = function(vid, cbk) {
			cbk('Cao niu ' + vid);
			return true;
			
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
			    endpoint: new AWS.Endpoint('nyc3.digitaloceanspaces.com'),
			    accessKeyId: config.objectSpaceDigitalOcean.accessKeyId,
			    secretAccessKey: config.objectSpaceDigitalOcean.secretAccessKey
			});
			
		}
		
		this.removeObjects = function(list, callback) {
			let me = this;
			var params = {
				Bucket: _space.space_id + 123,
				Delete: {Objects:list}
			};
			me.s3.deleteObjects(params, function(err, d) {
				if (err) return callback({err:'unable to remove Objects'});
				else callback(d);
			});
		}
		
		this.init();
	};
	module.exports = obj;
})();
