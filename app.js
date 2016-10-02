/**
 * Created by tal on 10/2/16.
 */
var express = require('express');
var app = express();

const PORT = process.env.PORT || 8080;

app.get('/', function (req, res) {
	res.sendFile('./index.html');
	res.end();
});

app.listen(PORT, function () {
	console.log('Example app listening on port ' + PORT + '!');
});