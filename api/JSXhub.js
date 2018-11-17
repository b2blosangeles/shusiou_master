var Babel  = require(env.root_path + "/package/qaletBabel/qaletBabel.js");
var CP  = require(env.root_path + "/package/crowdProcess/crowdProcess.js");

function cache_request(url, fn, cbk) {
	pkg.fs.stat(fn, function(err, stats) {
		if (err) {
			let file = pkg.fs.createWriteStream(fn);
			file.on('finish', function() {
				cbk(fn);
			});	
			pkg.request(url, function (err1, response, body) {
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
	
	cp1.parallel(_f1, function(data) {
		 cbk(true);
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
              var fn = env. site_path + decodeURIComponent(_includes[i]);
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

       res.send({success:true, inc: inc_str, master : master_str, err : err}); 
      // res.send({success:true, master: master_str, includes: inc_str, err : err});             
}, 3000);
