(function () { 
	var obj =  function (config, env, pkg) {
		this.init = function() {
			let me = this;
			const AWS = require(env.site_path + '/api/inc/aws-sdk/node_modules/aws-sdk')
			me.s3 = new AWS.S3({
			    endpoint: new AWS.Endpoint('nyc3.digitaloceanspaces.com'),
			    accessKeyId: config.objectSpaceDigitalOcean.accessKeyId,
			    secretAccessKey: config.objectSpaceDigitalOcean.secretAccessKey
			});
			
		}
		this.getBuckets = function(getBuckets_cbk) {	
			var me = this, params = {}, Buckets = {};
			me.s3.listBuckets(params, function(err, data) {
				if(err) {
					getBuckets_cbk({err:err.message});
					return true;
				} else {
					let astr = [],
					    list = [],
					    patt = new RegExp(config.environment);
					var connection = pkg.mysql.createConnection(config.db);
					connection.connect();
					for (var i = 0; i < data.Buckets.length; i++) {
						if (patt.test( data.Buckets[i].Name)) {
							list.push(data.Buckets[i].Name);
							astr.push("('" + data.Buckets[i].Name+ "', NOW())");
						}	
					}
					var str = "INSERT INTO `cloud_spaces` (`bucket`, `updated`) VALUES " + astr.join(',') + '';
					  //  ' ON DUPLICATE KEY UPDATE `updated` = NOW(); ';
					connection.query(str, function (err, results, fields) {
						connection.end();
						if (err) {
							getBuckets_cbk(list); 
						} else {
							getBuckets_cbk(list);
						}
					});
				}
			});	
		}		
		this.updateBucket = function(updateBucket_cbk) {
			var me = this, params = {};
			let connection = pkg.mysql.createConnection(config.db),
			    connection1 = pkg.mysql.createConnection(config.db);
			
			connection.connect();
			var str = "SELECT * FROM `cloud_spaces` WHERE 1 ORDER BY `updated` DESC LIMIT 1; ";
			connection.query(str, function (err, results, fields) {
				connection.end();
				if (err) {
					updateBucket_cbk({err:err.message}); 
				} else {
					let bucket = results[0].bucket, size_info = {};
					try { size_info = (!results[0].size_info) ? {} : JSON.parse(results[0].size_info); } catch (e) {}
					me.getBucketVids(bucket, function(size_info1) {
						for (key in size_info1) {
							if (!size_info[key]) {
								size_info[key] = size_info1[key];
							}
						}
						var qlist= [];
						for (key in size_info1) {
							if (!size_info[key]) {
								qlist.push(key);
							}
						}						
						let str1 = "UPDATE `cloud_spaces` SET `size_info`='"+
						    JSON.stringify(size_info) + "'" + 
						    ", `updated` = NOW()  WHERE `bucket` = '"+ bucket +"'; ";

						connection1.connect();
						connection1.query(str1, function (err, results, fields) {
							connection1.end();
							// updateBucket_cbk({size_info:size_info, size_info1:size_info1, qlist:qlist});
							me.getVid(bucket, qlist[0], updateBucket_cbk);
						});
					});
				}
			});			
			return true;
		}
		this.deleteBucket = function(bucket, deleteBucket_cbk) {	
			var me = this, params = {Bucket: bucket};
			me.s3.deleteBucket(params, function(err, data) {
				if(err) {
					deleteBucket_cbk({err:err});
				} else {
					deleteBucket_cbk(data);
				}
			});	
		}	
		this.cleanBucket = function(bucket, cleanBucket_cbk) {	
			var me = this, params = {Bucket: bucket};
			me.s3.listObjects(params, function(err, data) {
				if(err) {
					 cleanBucket_cbk({err:err});
				} else {
					var items = data.Contents;
					me.removeObjects(bucket, items, cleanBucket_cbk);
				}
			});	
		}		
		this.removeObjects = function(bucket, list, callback) {
			let me = this;
			var params = {
				Bucket: bucket,
				Delete: {Objects:[]}
			};
			for (var i = 0; i <Math.min(list.length, 1000); i++) {
				params.Delete.Objects.push({Key: list[i].Key});
			};
			me.s3.deleteObjects(params, function(err, d) {
				if (err) return callback(err);
				else callback(d);
			});
		}		
	
		this.getBucketVids = function(bucket_name, cbk) {	
			var  me = this;
			var CP = new pkg.crowdProcess();
			var _f = {};

			let v = {};
			let recursive_f = function(Marker, recursive_cbk) {
				var params1 = { 
					Bucket: bucket_name,
					MaxKeys : 1000,
					Marker : Marker,
					Delimiter: '/',
					Prefix: 'videos/'
				};
				me.s3.listObjects(params1, function (err, data) {
					if(err) {
						recursive_cbk({err:'err.message'});
						return true;
					} else {

						for (var i = 0; i < data.CommonPrefixes.length; i++) {
							v[data.CommonPrefixes[i].Prefix] = null;
						}

						if (data.IsTruncated) {
							recursive_f(data.NextMarker, recursive_cbk)

						} else {
							recursive_cbk(v);
						}
					}
				});						
			}
			recursive_f('', cbk);
		};
		this.getVid = function(bucket_name, prefix, cbk) {	
			var  me = this;
			var CP = new pkg.crowdProcess();
			var _f = {};

			let v = [];
			let recursive_f = function(Marker, recursive_cbk) {
				var params1 = { 
					Bucket: bucket_name,
					MaxKeys : 1000,
					Marker : Marker,
					Delimiter: '',
					Prefix: prefix
				};
				me.s3.listObjects(params1, function (err, data) {
					if(err) {
						recursive_cbk({err:'err.message'});
						return true;
					} else {
						v.push(data);
						/*
						for (var i = 0; i < data.Contents.length; i++) {
							
							//v[data.Contents[i].Name] = null;
						}
						*/
						if (data.IsTruncated) {
							recursive_f(data.NextMarker, recursive_cbk)

						} else {
							recursive_cbk(v);
						}
					}
				});						
			}
			recursive_f('', cbk);
		};		
	};
	module.exports = obj;
})();
