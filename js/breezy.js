/**
 * Created by tal on 10/2/16.
 */

// $(document).ready(function() {
// 	// $('#breezy-phone-submit').click(function() {
// 	// 	var phoneInput = $('#phone');
// 	// 	phoneInput.val();
// 	// });
// });

// function checkPhone(a, b) {
// 	console.log(a);
// 	console.log(b);
// 	console.log(b);
// }


$('#phone-form').submit(function (e) {
	console.log(e.target[0].value.split('-').join('').split('/').join('').split('(').join('').split(')').join('').split(' ').join(''));
	return false;
});