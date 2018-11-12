var Babel  = require(env.root_path + "/package/qaletBabel/qaletBabel.js");
var qaletBabel = new Babel();
var fn = env. site_path + req.query.url;
qaletBabel.jsx2js(fn, function(err, v) {
       res.send(v.code);
    // res.send(req.query.url + '====');
});

