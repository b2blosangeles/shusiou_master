(function () { 
	var obj =  function (config, env, pkg, tm) {
		
		let _space = { 
			space_id : 'shusiou-d-01',
			space_url :'https://shusiou-d-01.nyc3.digitaloceanspaces.com/'
		};	
		this.getBuckets = function(getBuckets_callback) {
			let me = this;
			
			var CP = new pkg.crowdProcess();
			var _f = {};
			
			_f['getVids'] = function(cbk0) {
				var params = {};
				delete require.cache[__dirname + '/inc_getBucketsVids.js'];
				var getBuckets = require(__dirname + '/inc_getBucketsVids.js')(me.s3);
				getBuckets.getBucketsVids(cbk0);
				CP.exit = 1;
				return true;
				
				me.s3.listBuckets(params, function(err, data) {
					if(err) {
						getBuckets_callback({err:err.message});
						return true;
					} else {	
						let total_size = 0, file_cnt = 0, v = [];
						let recursive_f = function(Marker, cbk) {
							var params1 = { 
								Bucket: data.Buckets[0].Name,
								Delimiter: '',
								MaxKeys : 1000,
								Marker : Marker,
								Delimiter: '/',
								Prefix: "shusiou_dev/"
							};

							me.s3.listObjects(params1, function (err, data) {
								if(err) {
									cbk({err:err.message});
									return true;
								} else {

									for (var i = 0; i < data.CommonPrefixes.length; i++) {
										v.push(data.CommonPrefixes[i].Prefix);
										// total_size +=  data.Contents[i].Size;
										// file_cnt ++;
									}

									if (data.IsTruncated) {
										recursive_f(data.NextMarker, cbk)

									} else {
										cbk(v);
										// cbk({file_cnt:file_cnt, total_size : total_size});
									}
								}
							});						
						}
						recursive_f('',cbk0);

					}
				});				
			}
			_f['scanVids'] = function(cbk0) {
				var vids = CP.data.getVids;
				var CP1 = new pkg.crowdProcess();
				var _f1 = {};
				for (var i = 0; i < vids.length; i++) {
					_f1['p_' + vids[i]] = (function(i) {
						return function(cbk1) {
							
//-----
							let total_size = 0, file_cnt = 0, v = [];
							let recursive_f = function(Marker, cbk) {
								var params1 = { 
									Bucket: 'shusiou-d-01',
									Delimiter: '',
									MaxKeys : 1000,
									Marker : Marker,
									Delimiter: '',
									Prefix: vids[i]
								};

								me.s3.listObjects(params1, function (err, data) {
									if(err) {
										cbk({err:err.message});
										return true;
									} else {

										for (var i = 0; i < data.Contents.length; i++) {
										//	v.push(data.Contents[i]);
											 total_size +=  data.Contents[i].Size;
											 file_cnt ++;
										}

										if (data.IsTruncated) {
											recursive_f(data.NextMarker, cbk)

										} else {
											cbk(total_size);
											// cbk({file_cnt:file_cnt, total_size : total_size});
										}
									}
								});						
							}
							recursive_f('',cbk1);
//-----
							
							
						}
					})(i);
				}
				CP1.parallel(
					_f1,
					function(data) {				
						cbk0({vids : data})
					},
					30000
				);
			}
			CP.serial(
				_f,
				function(data) {				
					getBuckets_callback(data);
				},
				30000
			);	
			return true;		
		
		};
		this.getBucketsBK = function(getBuckets_callback) {
			let me = this;
			var params = {};
			me.s3.listBuckets(params, function(err, data) {
				if(err) {
					getBuckets_callback({err:err.message});
					return true;
				} else {	
					let total_size = 0, file_cnt = 0, v = [];
					let _f = function(Marker, cbk) {
						var params1 = { 
							Bucket: data.Buckets[0].Name,
							Delimiter: '',
							MaxKeys : 1000,
							Marker : Marker,
							Delimiter: '/',
							Prefix: "shusiou_dev/"
							// Prefix: 'shusiou_dev/'
						};
						
						me.s3.listObjects(params1, function (err, data) {
							if(err) {
								cbk({err:err.message});
								return true;
							} else {
								v.push(data.CommonPrefixes);
								/*
								for (var i = 0; i < data.Contents.length; i++) {
								//	v.push(data.Contents[i]);
									total_size +=  data.Contents[i].Size;
									file_cnt ++;
								}
								*/
								if (data.IsTruncated) {
									_f(data.NextMarker, cbk)
									
								} else {
									cbk(v);
									// cbk({file_cnt:file_cnt, total_size : total_size});
								}
							}
						});						
					}
					_f('', getBuckets_callback);
					
				}
			});	
			return true;		
		
		};		
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
						for (var i = 0; i < data.Contents.length; i++) {
							v.push({Key :  data.Contents[i].Key})
						}
						me.removeObjects(rec.vid, v, cbk);
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
			    endpoint: new AWS.Endpoint('nyc3.digitaloceanspaces.com'),
			    accessKeyId: config.objectSpaceDigitalOcean.accessKeyId,
			    secretAccessKey: config.objectSpaceDigitalOcean.secretAccessKey
			});
			
		}
		
		this.removeObjects = function(vid, list, callback) {
			let me = this;
			var params = {
				Bucket: _space.space_id,
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
