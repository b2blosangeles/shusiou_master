(function () { 
	var obj =  function (s3) {	
		this.getBucketsVids = function(getBucketsVids_callback) {
			//getBucketsVids_callback('getBucketsVids_callback');
			//return true;
		
			var params = {};
			s3.listBuckets(params, function(err, data) {
				if(err) {
					getBucketsVids_callback({err:err.message});
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

						s3.listObjects(params1, function (err, data) {
							if(err) {
								getBucketsVids_callback({err:err.message});
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
					recursive_f('', getBucketsVids_callback);

				}
				
			});
			
		};
		
	};
	module.exports = obj;
})();
