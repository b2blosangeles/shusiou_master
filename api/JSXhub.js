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
cp.serial(_f, function(data) {
       res.send(cp.data.master);             
}, 3000);
