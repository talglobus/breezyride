/**
 * Created by tal on 10/2/16.
 */
var express = require('express');
var path = require('path');
var app = express();

const PORT = process.env.PORT || 8080;

app.get('/', function (req, res) {
	res.sendFile(path.join(__dirname + '/index.html'));
	res.end();
});

app.listen(PORT, function () {
	console.log('Example app listening on port ' + PORT + '!');
});