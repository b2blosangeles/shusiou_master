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
                     cbk({success: true, code: encodeURIComponent('var _asyncOBJ = ' + v.code)});
              }
       });
}

if ((req.body.includes) && (req.body.includes.length)) {
      for (var i = 0; i < req.body.includes.length; i++) {
          _f['inc_' + i] = (function(i) { return function(cbk) {
                                   var qaletBabel = new Babel();
                                   var fn = env. site_path + decodeURIComponent(req.body.includes[i]);
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
       
}
cp.serial(_f, function(data) {
       var inc_str = '', master_str = '', err = [];
       if ((req.body.includes) && (req.body.includes.length)) {
              for (var i = 0; i < req.body.includes.length; i++) {
                     if (cp.data['inc_' + i].success === true) {
                            inc_str += cp.data['inc_' + i].code;
                     } else {
                            err.push(cp.data['inc_' + i].err);
                     }
              }
       }
       if (cp.data.master.success === true) {
           master_str = cp.data.master.code 
       } else {
               err.push(cp.data.master.err);
       }
            
       // me.props.code
       var code = inc_str  + '; ' + master_str;

       res.send({success:true, code: code, err : err}); 
      // res.send({success:true, master: master_str, includes: inc_str, err : err});             
}, 3000);
