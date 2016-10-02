/**
 * Created by tal on 10/2/16.
 */

/**
 * Created by tal on 10/1/16.
 */

const INC = 12;
const SLOW = 100000;

var request = require('request');
var points = require('./points');
const AUTH = 'Bearer gAAAAABX8A5O1EAEWuduPDVNwAEOmRstfgqpFEzJtarWlOwtfpq6SWrDTnImsF4OV6aEF5dRPvX2pC_QQHXU0frJwuZtSV0HZN4YQ7HQhrzLd3D2KKAfd_aIJ51Ypg2zzdQA1815AauoLdnJVUdpFM0qLqC7tLuabGSxVS1Av4R6K0ylRtPxQ-zHrBJOzrWnoJedwytpCHWP6yJETdfJ2kB60Mwh7CK-nQ==';

module.exports = theLoop;

function queryLocation(lat, long, cb) {
	var options = {
		url: 'https://api.lyft.com/v1/drivers?lat=' + lat + '&lng=' + long + '&ride_type=lyft',
		headers: {
			Authorization: AUTH,
			Accept: 'application/json'
		}
	};

	request(options, function(err, res, body) {
		if (!err && res.statusCode == 200) {
			var data = JSON.parse(body);
			// var locations = data['nearby_drivers'][0].drivers;
			// console.log(new Date(res.headers.date).getTime());
			cb(null, data);
		} else {
			cb(err, false);
		}
	});
}

function theLoop() {
	var input = new Array(new Array());

	var timeoutNum = 0;
	console.log("Beginning Poll...");
	setInterval(function() {
			timeoutNum++;
			var i = timeoutNum % 38;
			// console.log(timeoutNum + ": " + points[i]);
			queryLocation(points[i].lat, points[i].long, function(err, res){
				if (!err && res) {
					// input[i].push(res);
					console.log(timeoutNum + ":");
					console.log(res['nearby_drivers'][0].drivers);
				} else {
					console.error("Search for X: " + points[i].x + ", Y: " + points[i].y + " failed");
				}
			});
		// }, (timeoutNum / SLOW) * 12);
		// if ((timeoutNum / SLOW) % 10000 == 0) {
		// 	console.log("Poll " + timeoutNum / SLOW);
		// }
	}, 12);
}

// var input = new Array();
// var num = 10;
//
// for (var i = 0; i < num; i++) {
// 	queryLocation(points[i].lat, points[i].long, function(err, res){
//  		if (!err && res) {
//  			input.push(res);
//  			console.log(res)
//  		} else {
//  			console.error("Search for X: " + points[i].x + ", Y: " + points[i].y + " failed");
//  		}
//  	});
// }

// console.log(input);

queryLocation(40.7589, -73.9851, function(err, res){
	if (!err && res) {
		console.log(res);
	}
});