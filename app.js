/**
 * Created by tal on 10/2/16.
 */
var express = require('express');
var path = require('path');
var fs = require('fs');
var app = express();

const PORT = process.env.PORT || 8080;

app.get('/', function (req, res) {
	res.writeHead(200, {"Content-Type": "text/html"});
	// res.sendFile(path.join(__dirname + '/index.html'));
	// res.write("Working");
	console.log("Attempting file " + path.join(__dirname + '/index.html'));
	fs.createReadStream(path.join(__dirname + '/index.html'))
		.pipe(res);
	// res.end();
});

app.get('/logo.png', function(req, res) {
	res.writeHead(200, {"Content-Type": "image/png"});

	var pathToServe = path.join(__dirname + "/logo.png");
	fs.createReadStream(pathToServe)
		.pipe(res);
});

app.get('/images/*', function (req, res) {
	allowServeFromDir(req, res, 'jpg');
});

app.get('/js/*', function (req, res) {
	allowServeFromDir(req, res, 'js');
});

app.get('/css/*', function (req, res) {
	allowServeFromDir(req, res, 'css');
});

app.get('/fonts/*', function (req, res) {
	allowServeFromDir(req, res, 'font');
});

app.listen(PORT, function () {
	console.log('Example app listening on port ' + PORT + '!');
});

function allowServeFromDir(req, res, type) {
	if (type == 'jpg') {
		res.writeHead(200, {"Content-Type": "image/jpeg"});
	} else if (type == 'js') {
		res.writeHead(200, {"Content-Type": "application/javascript"});
	} else if (type == 'css') {
		res.writeHead(200, {"Content-Type": "text/css"});
	} else if (type == 'font') {
		res.writeHead(200, {"Content-Type": "application/font-woff"});
	} else {
		res.writeHead(200, {"Content-Type": "image/html"});     // This is a dangerous case, as it leaves html default
	}

	var pathToServe = path.join(__dirname + req.url);
	doIfFile(pathToServe, function(err, data) {
		if (!err && !!data) {
			fs.createReadStream(pathToServe)
				.pipe(res);
			console.log("Found and served file " + pathToServe);
		} else {
			console.error("File search failed for " + pathToServe);
		}

	});
}

function doIfFile(file, cb) {
	fs.stat(file, function fsStat(err, stats) {
		if (err) {
			if (err.code === 'ENOENT') {
				return cb(null, false);
			} else {
				return cb(err);
			}
		}
		return cb(null, stats.isFile());
	});
}
