var mysql = require(env.site_path + '/api/inc/mysql/node_modules/mysql'),
    config = require(env.config_path + '/config.json'),
    cfg0 = config.db;

pkg.mysql = mysql;


delete require.cache[env.sites_path + '/master/api/inc/awsS3Video/awsS3VideoAdmin.js'];
let awsS3VideoAdmin = require(env.sites_path + '/master/api/inc/awsS3Video/awsS3VideoAdmin.js');
 
 
let s3 = new AWS.S3({
    endpoint: new AWS.Endpoint('nyc3.digitaloceanspaces.com'),
    accessKeyId: config.objectSpaceDigitalOcean.accessKeyId,
    secretAccessKey: config.objectSpaceDigitalOcean.secretAccessKey
}); 
 
 
 var params = {};
 s3.listBuckets(params, function(err, data) {
   if (err)  res.send((err.message); // an error occurred
   else     res.send(data);           // successful response
 });
 
 /*
let tm = new Date().getTime();


var videoAdmin = new awsS3VideoAdmin(config, env, pkg, tm);	
 videoAdmin.delete(function(data) {
	//let delta_time = new Date().getTime() - tm;
	res.send(data);

});
*/
