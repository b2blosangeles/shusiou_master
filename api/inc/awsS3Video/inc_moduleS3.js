(function () { 
	var obj =  function (s3, config, env, pkg) {	
		this.getBuckets = function(getBuckets_callback) {	
			var me = this, params = {}, Buckets = {};
			s3.listBuckets(params, function(err, data) {
				if(err) {
					getBuckets_callback({err:err.message});
					return true;
				} else {
					let CP = new pkg.crowdProcess(),
					    _f = {};
					for (var i = 0; i < data.Buckets.length; i++) {
						_f[data.Buckets[i].Name] = (function(i) {
							return function(cbk){
								me.getBucketsVids(data.Buckets[i].Name,
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
							getBuckets_callback(Buckets);
						},
						30000
					);
				}
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
					Prefix: "shusiou_dev/"
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
