#!/usr/bin/env node

var program = require('commander'),
    oauth,
    request = require('request'),
    url;

program
  .version('0.0.1')
  .option('-o, --oauth <path to oauth.json>', 'A JSON file with login credentials')
  .option('-m, --method <GET|POST>', 'The method to use - GET or POST')
  .option('-r, --resource <resource>', 'The resource to use e.g. /statuses/user_timeline.json')
  .option('-p, --params <params>', 'OPTIONAL Twitter params in string format')
  .parse(process.argv);

if (!validateOAuth(program.oauth) || !validateMethod(program.method) || !validateResource(program.resource)) {
    program.help();
}

if (program.params) {
    url = 'https://api.twitter.com/1.1' + program.resource + "?" + program.params;
}
else {
    url = 'https://api.twitter.com/1.1' + program.resource;
}

request({
            method: program.method,
			url: url,
			oauth: oauth
		}
		, function(e, r, body) {
			if (e) {
				return console.error('Twitter request failed:' + e);
			}
            process.stdout.write(body);
		}
	);
    

function validateOAuth(oauthFile) {
    if (!oauthFile) {
        return false;
    }

    oauth = require(oauthFile);
    return true;
}

function validateMethod(method) {
    return (method == 'GET' || method == 'POST');
}

function validateResource(resource) {
    return resource;
}
