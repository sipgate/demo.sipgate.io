$(document).ready(function () {
	// Append numbers to phone number table
	function insertRow(from, to) {
		$("#phone-number-table").find('tbody')
			.prepend($('<tr>')
				.append($('<td>')
					.text(from)
				)
				.append($('<td>')
					.text(to)
				)
				.append($('<td>')
					.text(moment().format('hh:mm:ss') + " Uhr")
				)
			);
	}

	// Insert one dummy row after three seconds
	window.setTimeout(function(){
		insertRow("0211 12345XXX", "01579 1234XXX");
	}, 3000);

	// Connect socket.io client
	var sock = io.connect();

	// Listen for 'new call' events
	sock.on('new call', function (data) {
		console.log(data);

		// Update number box
		$('#number').text(data.from);

		// Append number to phone number table
		insertRow(data.from, data.to);

		// Animate phone image
		$('#phone').addClass("animated tada");
		window.setTimeout(function(){
			$('#phone').removeClass("animated tada");
		}, 2000);
	});
});
