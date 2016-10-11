/**
 * Created by tal on 10/2/16.
 */

// Twilio Credentials
var accountSid = 'AC4aedd4057f5ae7cfcfa435db371522d2';
var authToken = '98ca45089c1ed2c223c1bb449bbe486b';

//require the Twilio module and create a REST client
var client = require('twilio')(accountSid, authToken);

module.exports = sendMessage;

function sendMessage(phone, msg) {
	client.messages.create({
		to: phone,
		// from: "415-527-3399",
		from: "BreezyRide",
		body: msg
	}, function (err, message) {
		if (!err) {
			console.log("Send " + message.sid + " as BreezyRide");
		} else if (err.status == 400) {
			client.messages.create({
				to: phone,
				from: "415-527-3399",
				body: msg
			}, function (err, message) {
				if (!err) {
					console.log("Sent " + message.sid + " as 415-527-3399");
				} else {
					console.log(err);
				}
			});
		} else {
			console.log(err);
		}
	});
}