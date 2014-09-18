$(document).ready(function () {
	// Append numbers to phone number table
	function insertRow(from, to) {
		var date = new Date();

		$("#phone-number-table").find('tbody')
			.prepend($('<tr>')
				.append($('<td>')
					.text(from)
				)
				.append($('<td>')
					.text(to)
				)
				.append($('<td>')
					.text(date.toLocaleFormat("%H:%M:%S Uhr"))
				)
			);
	}

	// Insert one dummy row
	insertRow("0211 12345XXX", "01579 1234567");

	// Connect socket.io client
	var sock = io.connect();

	// Listen for 'new call' events
	sock.on('new call', function (data) {
		console.log(data);

		$('#number').text(data.from);

		insertRow(data.from, data.to);

		$('#phone').addClass("animated tada");
		window.setTimeout(function(){
			$('#phone').removeClass("animated tada");
		}, 2000);
	});
});
