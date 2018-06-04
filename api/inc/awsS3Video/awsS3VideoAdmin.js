(function () { 
	var obj =  function (config, env, pkg, tm) {
		/*
		this.getSpaceId = function(space) {
			let patt = /https\:\/\/([^.]+)\./ig;
			let r = patt.exec(space);
			return r[1];
		}
		*/
		this.delete = function(delete_callback) {
			let me = this, buckets = [];
			me.deleteList = [];
			me.s3.listBuckets({}, function (err, data) {
				if (err) console.log(err, err.stack);
				else {
					for (var i=0; i < data.Buckets.length ; i++) {
						
						let environment = '-' + config.environment + '-'
						if (new RegExp(environment).test(data.Buckets[i].Name)) {
							buckets.push(data.Buckets[i].Name);
						}
					}
					for (var i = 0; i < buckets.length;  i++) {
						me.scanAllBucketVideos(buckets[i], '', function(data) {
							console.log(data);
						});
					}
				}
			});
			return true;
		}	
		this.removeVidFromSpace = function(space, vid, cbk) {
			let me = this;
			let space_dir = 'videos/' + vid;
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
						me.cleanVideoRec(vid, cbk);
					} else {
						for (var i = 0; i < data.Contents.length; i++) {
							v.push({Key :  data.Contents[i].Key})
						}
						me.removeObjects(space, vid, v, cbk);
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
		}
	
		this.findNeedToDelete = function(list, cbk) {
			let me = this, exist_list = [], remove_list = [];
			var connection = pkg.mysql.createConnection(config.db);
			connection.connect();
			var str = 'SELECT `vid` FROM `video` WHERE `vid` IN (' + list.join(',') + ')';

			connection.query(str, function (err, results, fields) {
				connection.end();
				if (err) {
					console.log(err.message);
				} else {
					for (var i = 0; i < results.length; i++) {
						exist_list[exist_list.length] =  results[i].vid;
					}
					for (var i = 0; i < list.length; i++) {
						if (exist_list.indexOf(list[i].replace('"', '')) === -1) {
							remove_list[remove_list.length] = list[i].replace('"', '');
						}					
					}
					cbk(remove_list); 
				}	
			});			
			return true;
		}	
		
		this.scanAllBucketVideos = function(bucket, Marker, callback) {
			let me = this;
			let space_dir = 'videos/';
			var params = { 
				Bucket: bucket,
				Delimiter: '/',
				MaxKeys : 3,
				Marker : Marker,
				Prefix: space_dir
			}, v = [];
			
			me.s3.listObjects(params, function (err, data) {
				if(err) {
					cbk({err:err.message});
					return true;
				} else {	
					if (!data.CommonPrefixes.length) {
						callback(me.deleteList);
					} else {
						for (var i = 0; i < data.CommonPrefixes.length; i++) {
							let prefix = data.CommonPrefixes[i].Prefix;
							v.push('"' + prefix.replace(new RegExp('^videos/'), '').replace(new RegExp('/'), '') + '"')
						}
						me.findNeedToDelete(v, function(remove_list) {
							me.deleteList = me.deleteList.concat(remove_list);
							console.log(me.deleteList);
							if (data.NextMarker) {
								me.scanAllBucketVideos(bucket, data.NextMarker, callback);
							}
						});
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
