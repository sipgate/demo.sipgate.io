$(document).ready(function () {

	// Update website with new call
	function newCall(from, to) {
		// Update number box
		$('#number').text(from);

		// Append number to phone number table
		$("#phone-number-table").find('tbody')
			.prepend($('<tr class="animated zoomInDown">')
				.append($('<td>')
					.text(from)
				)
				.append($('<td>')
					.text(to)
				)
				.append($('<td>')
					.text(moment().format('HH:mm:ss') + " Uhr")
				)
			);

		// Animate phone image
		$('#phone').addClass("animated tada");

		// Remove animation classes after animation ends
		window.setTimeout(function(){
			$('.animated').removeClass("animated tada zoomInDown");
		}, 1000);
	};

	// Insert one dummy row after two seconds
	window.setTimeout(function(){
		newCall("0211 12345XXX", "01579 1234XXX");
	}, 2000);


	// Connect socket.io client
	var sock = io.connect();

	// Listen for 'new call' events
	sock.on('new call', function (data) {
		console.log(data);

		newCall(data.from, data.to);
	});
});
