var Babel  = require(env.root_path + "/package/qaletBabel/qaletBabel.js");
var qaletBabel = new Babel();
var fn = env. site_path + decodeURIComponent(req.query.url);
qaletBabel.jsx2js(fn, function(err, v) {
       res.send({code: encodeURIComponent('me._pluginObj = ' + v.code)});
    // res.send(req.query.url + '====');
});

