(function () { 
	var obj =  function (config, env, pkg, tm) {
		
		let _space = { 
			space_id : 'shusiou-d-01',
			space_url :'https://shusiou-d-01.nyc3.digitaloceanspaces.com/',
			mnt_folder : '/var/shusiou_video/'
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
		this.removeVidFromSpace = function(space, cbk) {
			cbk(space);
			return true;
			let me = this,
			    _p = video_name.match(/(.+)\/([^\/]+)$/);
				
			me.source_path = _p[1] + '/';
			me.source_file = _p[2];
			me.space_id = space.space_id;
			me.space_url = space.space_url;
			me.space_info = 'shusiou_' +  config.environment + '/' + me.source_file + '/_info.txt';
			me.trunkSize = 512 * 1024;
			me.vid = vid;
			
			pkg.request(me.space_url +  me.space_info, 
				function (err, res, body) {
					let v = (err) ? false : {};
					if (v !== false) { 
						try {  v = JSON.parse(body); } catch (e) { v = false; }
					}
					if (!v || !v.status || !v.status._s || !v.status._t) {
						let CP_A = new pkg.crowdProcess(), 
						    _fA = {};
						
						_fA['_s'] = function (cbks) { me.split('_s', video_name, cbks); }
						_fA['_t'] = function (cbks) { me.split('_t', video_name, cbks); }
						CP_A.parallel( _fA,
							function(results) {
								cbk(results);
							},
							50000
						);											

					} else {
						me.doneDBVideoStatus(v, function(d) {
							if (d) {
								let tmp_root = '/var/shusiou_cache/tmpvideo/' + me.source_file + '/';
								pkg.exec('rm -fr ' + tmp_root + ' && rm -fr ' + video_name, 
									function(err, stdout, stderr) {
										cbk('This video already been processed.' + me.vid);
								//	me.load();
								});								 
							}
						});

					}
				});
			

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
		this.split = function(_type, _file, _cbk) {
		};			
			
		this.init = function() {
			let me = this;
			const AWS = require(env.site_path + '/api/inc/aws-sdk/node_modules/aws-sdk')
			me.s3 = new AWS.S3({
			    endpoint: new AWS.Endpoint('nyc3.digitaloceanspaces.com'),
			    accessKeyId: config.objectSpaceDigitalOcean.accessKeyId,
			    secretAccessKey: config.objectSpaceDigitalOcean.secretAccessKey
			});
			
		}
		this.getInfo = function(space_infoname, south_name, cbk) {
			let me = this;
			pkg.request(space_infoname, 
			function (err, res, body) {
				let v = (err) ? false : {};
				if (v !== false) { 
					try {  v = JSON.parse(body); } catch (e) { v = false; }
				}
				if (v === false) { 
					let buff = new Buffer(100);
					pkg.fs.stat(south_name, function(err, stat) {
						if (err) {
							cbk(false);
							return true;
						}
						pkg.fs.open(south_name, 'r', function(err, fd) {
							pkg.fs.read(fd, buff, 0, 100, 0, function(err, bytesRead, buffer) {
								if (err) {
									CP.exit = 1;
									cbk(err.message);
									return true;
								}									
								var start = buffer.indexOf(new Buffer('mvhd')) + 17;
								var timeScale = buffer.readUInt32BE(start, 4);
								var duration = buffer.readUInt32BE(start + 4, 4);
								var movieLength = Math.floor(duration/timeScale);
								var v = {filesize:stat.size,time_scale:timeScale, trunksize: me.trunkSize,
									duration: duration, length:movieLength, status:{}};
								me.writeInfo(v, function() {
									cbk(v);
								});
							});
						});
					});		
				} else {
					cbk(v);
				}
			});			
		}
		this.writeInfo = function(v, cbk) {
			let me = this,
			    params = {
				Body: JSON.stringify(v),
				Bucket: me.space_id,
				Key: me.space_info,
				ContentType: 'text/plain',
				ACL: 'public-read'
			};	

			me.s3.putObject(params, function(err, data) {
				if (err) cbk(false);
				else cbk(true);
				// me.doneDBVideoStatus(v, cbk);
			});		
		}
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
		this.splitVideo = function(_type, tmp_folder, cbk) {
			let me = this;
			switch(_type) {
				case '_t':
					pkg.exec('rm -f ' + tmp_folder + '* ' + ' && rm -f ' + tmp_folder + '*.* ' +
						 '&& split -b ' + me.trunkSize + ' ' + me.source_path +  me.source_file +  ' ' + tmp_folder + '', 					 
						{maxBuffer: 1024 * 500}, 
						 function(err, stdout, stderr) {
							if (err) {
								cbk({err:err.message});
							} else {
								pkg.fs.readdir( tmp_folder, (err1, files) => {
									cbk((err1) ? {err:err1.message} : {list:files});
								});			
							} 
						});
					break;
				case '_s':
					pkg.exec('rm -f ' + tmp_folder + '* ' + ' && rm -f ' + tmp_folder + '*.* ' +
						 '&& ffmpeg -i ' + me.source_path +  me.source_file + 
						 ' -c copy -map 0 -segment_time 5 -reset_timestamps 1 -f segment ' + tmp_folder + 's_%d.mp4', 
						 {maxBuffer: 1024 * 500}, 
						function(err, stdout, stderr) {
							if (err) {
								cbk({err:err.message});
							} else {
								pkg.fs.readdir( tmp_folder, (err1, files) => {
									cbk((err1) ? {err:err1.message} : {list:files});
								});			
							}
						});
					break;	
				default:
					cbk({err:'Missing _type'});
			}		
		}		
		
		this.init();
	};
	module.exports = obj;
})();
