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
					// delete_callback(results);
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
				MaxKeys : 100,
				Marker : '',
				Prefix: space_dir
			}, v = {};
			
			me.s3.listObjects(params, function (err, data) {
				if(err) {
					CP.exit = 1;
					cbk({err:err.message});
					return true;
				}	
				for (var o in data.Contents) {
					let key = data.Contents[o].Key.replace(space_dir, '');
					v[key] = data.Contents[o].Size;
				}
				if (!v.length) {
					// cbk({err:'niu--err.message'});
					me.cleanVideoRec(rec.vid, cbk);
				} else {
					me.removeObjects(space_dir, v, cbk);
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
			    endpoint: new AWS.Endpoint('nyc3.digitaloceanspaces.com'),
			    accessKeyId: config.objectSpaceDigitalOcean.accessKeyId,
			    secretAccessKey: config.objectSpaceDigitalOcean.secretAccessKey
			});
			
		}
		
		this.removeObjects = function(folder, list, callback) {
			let me = this;
			var params = {
				Bucket: _space.space_id,
				Delete: {Objects:[]}
			};
			
			for (var k in list) {
				params.Delete.Objects.push({Key: folder + k});
				if (params.Delete.Objects.length === 333) {
					break;
				}
			};
		//	callback(params.Delete.Objects);
		//	return true;
			me.s3.deleteObjects(params, function(err, d) {
				if (err) return callback(err);
				else callback(d);
			});
		}
		
		this.init();
	};
	module.exports = obj;
})();
