/**
 * Created by tal on 10/4/16.
 */

const fs = require('fs');
// const zlib = require('zlib');
const stream = require('stream');
var gzip = zlib.createGzip();

module.exports = (filePath) => {
	var stream = fs.createWriteStream(filePath, {flags: "a", defaultEncoding: "utf8"});

	this.logJSON = (input) => {
		var flatInput = JSON.stringify(input);  // This could potentially be a very expensive operation
		// zlib.gzip(flatInput, (err, buffer) => {
		// 	if (!err) {
				stream.write(flatInput, (err, res) => {
					if (err) {
						stream.write(flatInput, () => {}); // No error handling for file write. Just retrying
						// TODO: Fix line above later, seriously
					}
				});
				console.log(buffer.toString('base64'));
			// } else {
			// 	// No error handling for gzipping, which could be an issue considering the size of the data
			// }
		// });
	};
};

// module.exports = (filePath) => {
// 	var stream = fs.createWriteStream(filePath, {flags: "a", defaultEncoding: "utf8"});
//
// 	this.logJSON = (input) => {
// 		var flatInput = JSON.stringify(input);  // This could potentially be a very expensive operation
// 		zlib.gzip(flatInput, (err, buffer) => {
// 			if (!err) {
// 				stream.write(buffer, (err, res) => {
// 					if (err) {
// 						stream.write(buffer, () => {}); // No error handling for file write. TODO: Fix later, seriously
// 					}
// 				});
// 				console.log(buffer.toString('base64'));
// 			} else {
// 				// No error handling for gzipping, which could be an issue considering the size of the data
// 			}
// 		});
// 	};
// };