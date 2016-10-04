/**
 * Created by tal on 10/2/16.
 */

/**
 * Created by tal on 10/1/16.
 */

// const INC = 12;
const INC = 30;
const ALERT_INTERVAL = 10000;  // Note that this value is a divisor, and alerts decrease as value increases
const DEBUGGING = !!process.env.DEBUGGING || false;

const request = require('request');
const points = require('./points');
// const loggerFactory = require('./logger');
const AUTH = "Bearer " + process.env.LYFT_API_TOKEN;

// const successLog = loggerFactory('./logs/successes1.txt');
// const failLog = loggerFactory('./logs/failures1.txt');

// console.log(successLog);
// console.log(failLog);
// console.log(loggerFactory);

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
		// console.log("Error:");
		// console.log(res);
		// console.log("Result:");
		// console.log(err);
		// console.log("Body:");
		// console.log(body);


		if (!err && res.statusCode == 200) {
			var data = JSON.parse(body);
			// var locations = data['nearby_drivers'][0].drivers;
			// console.log(new Date(res.headers.date).getTime());
			cb(null, data);
		} else {
			console.error(err);
			debugLog(res);
			debugLog(body);
			cb(err, false);
		}
	});
}

function theLoop() {
	var successfulPings = new Array();
	var failedPings = new Array();

	var recentSuccessfulPings = new Array();
	var recentFailedPings = new Array();

	var seriesSent = 0; // This is the number of ALERT_INTERVAL rounds of requests sent thus far.

	var timeoutNum = 0;
	console.log("Beginning Poll...");
	setInterval(function() {
		timeoutNum++;
		var i = timeoutNum % 38;
		// console.log("Poll " + timeoutNum + ": (" + points[i].lat + ", " + points[i].long + ")");
		// console.log(timeoutNum + ": " + points[i]);
		queryLocation(points[i].lat, points[i].long, (err, res) => {
			if (!err && res) {
				// input[i].push(res);
				// console.log(timeoutNum + ":");
				// var numSectionDrivers = res['nearby_drivers'][0].drivers.length;
				// console.log(numSectionDrivers + " drivers on the road in section " + timeoutNum % 38);
				recentSuccessfulPings.push(res);
				// successLog.logJSON(res);
			} else {
				console.error("Search for X: " + points[i].x + ", Y: " + points[i].y + " failed");
				debugLog("Error:  " + err);
				debugLog("Result: " + res);
				recentFailedPings.push(new Array(err, res));
				// failLog.logJSON(new Array(err, res));
			}
		});


		if (timeoutNum % ALERT_INTERVAL == 0) {
			seriesSent++;

			var numRecentSuccessful = recentSuccessfulPings.length,
				numRecentFailed = recentFailedPings.length,
				totalSent = ALERT_INTERVAL * seriesSent,
				totalSuccessful = successfulPings.length + recentSuccessfulPings.length,
				totalFailed = failedPings.length + recentFailedPings.length;

			console.log(totalSent + " Pings Sent: " + totalSuccessful + " successful, " + totalFailed  + " failed, "
				+ (totalSent - totalSuccessful - totalFailed) + " requests yet incomplete.");

			console.log("Most recent " + ALERT_INTERVAL + " Pings Sent: " + numRecentSuccessful  + " successful, "
				+ numRecentFailed + " failed, " + (ALERT_INTERVAL - numRecentSuccessful - numRecentFailed)
				+ " yet incomplete.");

			console.log("Of the past " + ALERT_INTERVAL + " pings, " + (numRecentSuccessful / ALERT_INTERVAL * 100)
				+ "% have been successful, " + (numRecentFailed / ALERT_INTERVAL * 100) + "% have failed, and "
				+ ((ALERT_INTERVAL - numRecentSuccessful - numRecentFailed) / ALERT_INTERVAL * 100) + "% are yet incomplete.");

			successfulPings = successfulPings.concat(recentSuccessfulPings);
			recentSuccessfulPings = [];

			failedPings = failedPings.concat(recentFailedPings);
			recentFailedPings = [];
		}
	}, INC);
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

queryLocation(40.7589, -73.9851, (err, res) => {
	if (!err && res) {
		debugLog(res);
	}
});

function debugLog(input) {
	if (DEBUGGING) {
		console.error(input);
	}
}