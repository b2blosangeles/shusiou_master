var Babel  = require(env.root_path + "/package/qaletBabel/qaletBabel.js");
var CP  = require(env.root_path + "/package/crowdProcess/crowdProcess.js");
var FolderP  = require(env.root_path + "/package/folderP/folderP.js");

function cache_request(url, fn, cbk) {
	pkg.fs.stat(fn, function(err, stats) {
		//if (err || (new Date().getTime() - stats.mtime) > ((req.body.timeout) ? req.body.timeout : 6000)) {
			pkg.request(url, {rejectUnauthorized: false}, function (err, response, body) {
				if (!err) {
					pkg.fs.writeFile(fn, body, function (err) {
					  if (err) cbk(false);
					  else  cbk(true);
					})
				} else {
					cbk(false);
				}
			})
		//} else {
		//	cbk(true);
		//}
	});
}

var cp = new CP();
var _f = [];
var _includes = (req.body.includes) ? req.body.includes : [], _error = [];
    _main = (req.body.main) ? req.body.main : '';
	root_main = (req.body.main) ? req.body.main : '';

var uurl = '';

_f.mkcachefolder = function(cbk) {
	var me = this;
	var fp = new FolderP();
	fp.build('/tmp/cache/', cbk);
}

_f.pre = function(cbk) {
    	var cp1 = new CP();
	var _f1 = [];
	var patt = /^(http\:|https\:|)\/\//ig;
	
	_f1['P_main'] = function(cbk1) {
		var m = _main.match(patt);
		if (patt.test(_main)) {
			var p = '/tmp/cache/'+ _main.replace(patt, '').replace(/\//g, '_'); 
			var url = ((m[0] === '//') ? 'http://' : m[0]) +  _main.replace(patt, '');
			uurl = url;
			cache_request(url, p, function(status) {
				if (status) {
					_main = p;
				} else {
					 _error.push('Error on:' + _main);
					 _main =  null;
				}

				cbk1(status);
			});
		} else {
			_main = env. site_path + _main;
			cbk1(_main);
		}
	}
	
	for (var i = 0; i < _includes.length; i++) {
		_f1['P_' + i] = (function(i) { return function(cbk1) {
				var m = _includes[i].match(patt);
				if (patt.test(_includes[i])) {
					var p = '/tmp/cache/'+ _includes[i].replace(patt, '').replace(/\//g, '_'); 
					var url = ((m[0] === '//') ? 'http://' : m[0]) +  _includes[i].replace(patt, '');
					cache_request(url, p, function(status) {
						if (status) {
							_includes[i] = p;
						} else {
							 _error.push('Error on:' + _includes[i]);
							_includes[i] =  null;
						}
						
						cbk1(status);
					});
				} else {
					_includes[i] = env. site_path + _includes[i];
					cbk1(_includes[i]);
				}
			}
		})(i)
	}
	//cp1.serial cp1.parallel
	cp1.parallel(_f1, function(data) {
		 cbk(data);
	},3000);
}



_f.master = function(cbk) {
       var qaletBabel = new Babel();
	if (!_main) {
		cbk({success: false, err:'Missing main'});
		return true;
	}
       var fn = decodeURIComponent(_main);
       qaletBabel.jsx2js(fn, function(err, v) {
              if (err) {
                     cbk({success: false, err:err.message})
              } else {
                      cbk({success: true, code: encodeURIComponent(v.code)});
              }
       });
}


for (var i = 0; i < _includes.length; i++) {
   if (!_includes[i])	continue;
   _f['inc_' + i] = (function(i) { return function(cbk) {
              var qaletBabel = new Babel();
              var fn = decodeURIComponent(_includes[i]);
                     qaletBabel.jsx2js(fn, function(err, v) {
                            if (err) {
                                   cbk({success: false, err:err.message});
                            } else {
                                   cbk({success: true, code: encodeURIComponent(v.code)});
                            }
                     });
              }
       })(i)
}
       

cp.serial(_f, function(data) {
       var inc_str = '', master_str = '', err = [];
  
       for (var i = 0; i < _includes.length; i++) {
	       if (!_includes[i])	continue;
              if (cp.data['inc_' + i].success === true) {
                     inc_str += cp.data['inc_' + i].code;
              } else {
                     err.push(cp.data['inc_' + i].err);
              }
       }

       if (cp.data.master.success === true) {
           master_str = cp.data.master.code 
       } else {
               err.push(cp.data.master.err);
       }
	 res.send({success:true, masterUrl: 'rootmain' + root_main + '::mian=='+_main + '::posted==' + req.body.main, inc: inc_str, master : master_str, err : (_error.length) ? _error : err});
      // res.send({p:cp.data.pre, success:true, inc: inc_str, master : master_str, err : (_error.length) ? _error : err}); 
      // res.send({success:true, master: master_str, includes: inc_str, err : err});             
}, 6000);
