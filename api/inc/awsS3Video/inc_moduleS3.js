(function () { 
	var obj =  function (s3, config, env, pkg) {	
		this.getBuckets = function(getBuckets_cbk) {	
			var me = this, params = {}, Buckets = {};
			s3.listBuckets(params, function(err, data) {
				if(err) {
					getBuckets_cbk({err:err.message});
					return true;
				} else {
					me.cleanBucket('shusiou-d-01', getBuckets_cbk);
					// getBuckets_cbk(data);
					return true;
					let CP = new pkg.crowdProcess(),
					    _f = {};
					for (var i = 0; i < data.Buckets.length; i++) {
						_f[data.Buckets[i].Name] = (function(i) {
							return function(cbk){
								me.getBucketsVids(data.Buckets[i],
									function(data) {
										cbk(data)
									}
								);
							}
						})(i)
					}
					CP.serial(
						_f,
						function(cpresult) {	
							getBuckets_callback(cpresult.results);
						},
						30000
					);
				}
			});	
		}
		this.deleteBucket = function(bucket, deleteBucket_cbk) {	
			var me = this, params = {Bucket: bucket};
			s3.deleteBucket(params, function(err, data) {
				if(err) {
					deleteBucket_cbk({err:err});
				} else {
					deleteBucket_cbk(data);
				}
			});	
		}	
		this.cleanBucket = function(bucket, cleanBucket_cbk) {	
			var me = this, params = {Bucket: bucket};
			s3.listObjects(params, function(err, data) {
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
			for (var i = 0; i <list.length; i++) {
				params.Delete.Objects.push({Key: list[i].Key});
			};
			s3.deleteObjects(params, function(err, d) {
				if (err) return callback(err);
				else callback(d);
			});
		}		
	
		this.getBucketsVids = function(bucket_name, cbk0) {	
			var  me = this;
			var CP = new pkg.crowdProcess();
			var _f = {};

			let total_size = 0, file_cnt = 0, v = [];
			let recursive_f = function(Marker, cbk) {
				var params1 = { 
					Bucket: bucket_name,
					Delimiter: '',
					MaxKeys : 1000,
					Marker : Marker,
					Delimiter: '/',
					Prefix: "shusiou"
				};

				s3.listObjects(params1, function (err, data) {
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
			recursive_f('', cbk0);
		};
		
	};
	module.exports = obj;
})();
