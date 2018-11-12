var Babel  = require(env.root_path + "/package/qaletBabel/qaletBabel.js");
var qaletBabel = new Babel();
var fn = req.query.url;
qaletBabel.jsx2js(fn, function(err, v) {
       res.send(env);
    // res.send(req.query.url + '====');
});

