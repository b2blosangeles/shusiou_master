(function () { 
	var obj =  function (s3, _sapce, getBucketsVids_callbac) {	
		this.getBuckets = function(getBuckets_callback) {
			let me = this;
			
			var CP = new pkg.crowdProcess();
			var _f = {};
			
			_f['getVids'] = function(cbk0) {
				var params = {};
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

		
		};
		
	};
	module.exports = obj;
})();
