/**
 * Created by tal on 10/2/16.
 */

$('#phone-form').submit(function (e) {
	var phone = e.target[0].value.split('-').join('').split('/').join('').split('(').join('').split(')').join('').split(' ').join('');

	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4 && xhr.status == 200) {
			cb(xhr.responseText);
		}
	};

	xhr.overrideMimeType('text/plain');
	xhr.open("GET", ("/welcome/" + phone), true);
	xhr.send();

	// xhttp.open("GET", ("http://www.breezyride.com/welcome/" + phone), true);
	// xhttp.send();

	// e.stopPropagation();
	console.log("Logged");
	return false;
});