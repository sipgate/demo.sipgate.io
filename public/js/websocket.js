$(document).ready(function () {
	// Reset animation elements after animation ends
	$('body').on('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function (e) {
		$(e.target).removeClass("animated");
		$(e.target).removeClass("tada");
		$(e.target).removeClass("fadeIn");
		$(e.target).removeClass("zoomIn");
	});

	// Animate the phone image
	function ringPhone() {
		$('#phone').addClass("animated tada");
	}

	// Update and animate the phone number box
	function updatePhoneNumberBox(from) {
		$('#number').text(from);
		$('#number').addClass("animated zoomIn");
	}

	// Append a row to the log table
	function appendLogRow(from, to, direction) {
		$("#log tbody")
			.prepend($('<tr class="animated fadeIn">')
				.append($('<td>')
					.text(from)
				)
				.append($('<td>')
					.text(to)
				)
				.append($('<td>')
					.text(moment().format('HH:mm:ss') + " Uhr")
				)
				.append($('<td class="hidden-xs">')
					.text(direction)
				)
			);

		// Only keep 10 rows in log table
		$('#log tbody tr:nth-child(n+11)').remove();
	}

	// Connect socket.io client
	var sock = io.connect();

	// React on 'new call' events
	sock.on('new call', function (data) {
		console.log(data);

		var from = data.from;
		var to = data.to;
		var direction = data.direction;

		ringPhone();

		updatePhoneNumberBox(from);

		appendLogRow(from, to, direction);
	});
});
