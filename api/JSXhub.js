var Babel  = require(env.root_path + "/package/qaletBabel/qaletBabel.js");
var CP  = require(env.root_path + "/package/crowdProcess/crowdProcess.js");

var cp = new CP();
var _f = [];

_f.master = function(cbk) {
       var qaletBabel = new Babel();
       var fn = env. site_path + decodeURIComponent(req.body.main);
       qaletBabel.jsx2js(fn, function(err, v) {
              if (err) {
                     cbk({success: false, err:err.message})
              } else {
                     cbk({success: true, code: encodeURIComponent(v.code)});
              }
       });
}
if ((req.body.includes) && (req.body.includes.length)) {
      for (var i = 0; i < req.body.includes.length; i++) {
          _f['includes+' + i] = (function(i) { return function(cbk) {
                                   var qaletBabel = new Babel();
                                   var fn = env. site_path + decodeURIComponent(req.body.includes[i]);
                                          qaletBabel.jsx2js(fn, function(err, v) {
                                                 if (err) {
                                                        cbk({success: false, err:err.message})
                                                 } else {
                                                        cbk({success: true, code: v.code});
                                                 }
                                          });
                                   }
                            })(i)
      }
       
}
cp.serial(_f, function(data) {
       var inc_str = '', master_str = '', error = [];
       for (var i = 0; i < req.body.includes.length; i++) {
              if (cp.data['includes+' + i].success === true) {
                     inc_str += p.data['includes+' + i].code;
              } else {
                     error.push(p.data['includes+' + i].err);
              }
       }
       if (cp.data.master.success === true) {
           master_str = p.data.master.code 
       } else {
               error.push(p.data.master.err);
       }
       res.send({master: master_str, includes: inc_str, err : error});             
}, 3000);
