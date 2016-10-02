/**
 * Created by tal on 10/2/16.
 */
var express = require('express');
var app = express();

app.get('/', function (req, res) {
	res.send('Working');
});

app.listen(8080, function () {
	console.log('Example app listening on port 8080!');
});