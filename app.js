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
	res.end();
});

app.listen(PORT, function () {
	console.log('Example app listening on port ' + PORT + '!');
});