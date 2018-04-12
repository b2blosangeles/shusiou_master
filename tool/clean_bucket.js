/* ---  This cron is to upload video to a aws standard object space.  */

var path = require('path');
var env = {root_path:path.join(__dirname, '../../..')};
env.site_path = env.root_path + '/sites/master';
env.config_path = '/var/qalet_config';

var config = require(env.config_path + '/config.json');

let pkg = {
    	mysql		: require(env.site_path + '/api/inc/mysql/node_modules/mysql'),
    	crowdProcess	: require(env.root_path + '/package/crowdProcess/crowdProcess'),
	request		: require(env.root_path + '/package/request/node_modules/request'),
	exec		: require('child_process').exec,
	fs 		: require('fs')
}; 
const AWS = require(env.site_path + '/api/inc/aws-sdk/node_modules/aws-sdk');
var s3 = new AWS.S3({
    endpoint: new AWS.Endpoint('nyc3.digitaloceanspaces.com'),
    accessKeyId: config.objectSpaceDigitalOcean.accessKeyId,
    secretAccessKey: config.objectSpaceDigitalOcean.secretAccessKey
});
var bucket_name = 'shusiou-dev-1';
function s(Marker) {
	console.log('start-->');
	var params1 = { 
		Bucket: bucket_name,
		MaxKeys : 10,
		Marker : Marker,
		Delimiter: '/',
		Prefix: 'videos/'
		
	};
	s3.listObjects(params1, function (err, data) {
		console.log('data.Contents.length--->');
		if(err) {
			console.log({err:err});
			return true;
		} else {
			console.log(data.Contents.length);
			let list = [];
			for(var i = 0; i < data.Contents.length; i++) {
				list.push({Key : data.Contents[i].Key})
			}
			var params = {
				Bucket: bucket_name,
				Delete: {Objects:list}
			};
			/*
			s3.deleteObjects(params, function(err, d) {
				if (err) console.log(err);
				else s('');
			});*/			
		}
	});
}
s('');
