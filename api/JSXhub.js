var Babel  = require(env.root_path + "/package/qaletBabel/qaletBabel.js");
var CP  = require(env.root_path + "/package/crowdProcess/crowdProcess.js");

var qaletBabel = new Babel();
var fn = env. site_path + decodeURIComponent(req.body.main);
qaletBabel.jsx2js(fn, function(err, v) {
       if (err) {
              res.send({success: false, err:err.message})
       } else {
              res.send({success: true, code: encodeURIComponent(v.code)});
       }
});

