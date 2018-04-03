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
			let space_dir = 'shusiou_' + config.environment  + '/';
			var params = { 
				Bucket: me.space_id,
				Delimiter: '',
				MaxKeys : 1000,
				Marker : '',
				Prefix: space_dir
			}, v = {};
			cbk( params);
			return true;
			function listAllObject(params, callback) {
				me.s3.listObjects(params, function (err, data) {
					if(err) callback(err.message);
					for (var o in data.Contents) {
						let key = data.Contents[o].Key.replace(space_dir, '');
						v[key] = data.Contents[o].Size;
					}

					if (data.IsTruncated) {
						params.Marker = data.NextMarker;
						listAllObject(params, callback)
					} else {
						callback(v);
					}

				})

			}		
			listAllObject(params, function(v) {
				cbk(v.length)
			});
			return true;
		}
		this.doneDBVideoStatus = function(v, cbk) {
			let me = this;
			if ((v) && (v.status) && (v.status._t) && (v.status._s)) {
				var connection = pkg.mysql.createConnection(config.db);
				connection.connect();
				var str = "INSERT INTO `video_space` (`vid`, `space`, `status`, `added`) VALUES " +
					" ('" + me.vid + "', '" + _space.space_url + "', 1, NOW()) ON DUPLICATE KEY UPDATE `status` = 1 ";

				connection.query(str, function (error, results, fields) {
					connection.end();
					cbk('This video has been processed.' + me.vid) 
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
		/*
		this.removeObjects = function(folder, list, callback) {
			let me = this;
			var params = {
				Bucket: me.space_id,
				Delete: {Objects:[]}
			};		
			for (var i = 0; i < Math.min(list.length,100); i++) {
				params.Delete.Objects.push({Key: folder + list[i]});
			};
			me.s3.deleteObjects(params, function(err, d) {
				if (err) return callback(err);
				else callback(d);
			});
		}
		*/
		this.init();
	};
	module.exports = obj;
})();
