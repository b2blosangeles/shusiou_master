var Babel  = require(env.root_path + "/package/qaletBabel/qaletBabel.js");
var CP  = require(env.root_path + "/package/crowdProcess/crowdProcess.js");

function cache_request(url, fn, cbk) {
	pkg.fs.stat(fn, function(err, stats) {
		if (err) {
			let file = pkg.fs.createWriteStream(fn);
			file.on('finish', function() {
				cbk(fn);
			});	
			pkg.request(url, {rejectUnauthorized: false}, function (err, response, body) {			
			}).pipe(file);	
		} else {
			pkg.fs.utimes(fn, new Date(), stats.mtime, function() {
				cbk(fn);
			});
		}
	});
}



var cp = new CP();
var _f = [];
var _includes = (req.body.includes) ? req.body.includes : [], 
    _main = (req.body.main) ? req.body.main : '';

_f.pre = function(cbk) {
    	var cp1 = new CP();
	var _f1 = [];
	var patt = /^(http\:|https\:|)\/\//ig;
	
	for (var i = 0; i < _includes.length; i++) {
		_f1['P_' + i] = (function(i) { return function(cbk1) {
				var m = _includes[i].match(patt);
				if (patt.test(_includes[i])) {
					var p = '/tmp/cache/'+ _includes[i].replace(patt, '').replace(/\//g, '_'); 
					var url = ((m[0] === '//') ? 'http://' : m[0]) +  _includes[i];
					cache_request(_includes[i], p, function() {
						_includes[i] = p;
						cbk1(url);
					});
				} else {
					_includes[i] = env. site_path + _includes[i];
					cbk1(_includes[i]);
				}
			}
		})(i)
	}
	cp1.parallel(_f1, function(data) {
		 cbk(data);
	});
	
	/*
	var patt = /^(http|https)\/\//ig;
	for (var i = 0; i < _includes.length; i++) {
		if (patt.test(_includes[i])) {
			var p = '/tmp/cache/'+ _includes[i].replace(patt, '').replace(/\//g, '_');
			pkg.fs.exists(p, function(exists){
			})
		}
	}
	*/
      // cbk(true);
}


_f.master = function(cbk) {
       var qaletBabel = new Babel();
       var fn = env. site_path + decodeURIComponent(_main);
       qaletBabel.jsx2js(fn, function(err, v) {
              if (err) {
                     cbk({success: false, err:err.message})
              } else {
                      cbk({success: true, code: encodeURIComponent(v.code)});
              }
       });
}


for (var i = 0; i < _includes.length; i++) {
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

       res.send({p:cp.data.pre, success:true, inc: inc_str, master : master_str, err : err}); 
      // res.send({success:true, master: master_str, includes: inc_str, err : err});             
}, 3000);
