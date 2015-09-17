$(document).ready(function () {
	// Reset animation elements after animation ends
	$('body').on('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function (e) {
		$(e.target).removeClass("animated");
		$(e.target).removeClass("tada");
		$(e.target).removeClass("fadeIn");
		$(e.target).removeClass("zoomIn");
		$(e.target).removeClass("flash");
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
	function appendLogRow(from, to, direction, callId) {
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
				.append($('<td id="call' + callId + '" class="hidden-xs">')
					.text('Klingelt')
				)
			);

		// Only keep 10 rows in log table
		$('#log tbody tr:nth-child(n+11)').remove();
	}

	function updateCallStatus(callId, cause) {
		var element = $('#call' + callId);

		if (element.length > 0) {
			element[0].innerHTML = cause;
			element.parent().addClass('animated flash');
		}
	}

	var namespace = $('body').data("token");

	// Connect socket.io client
	var sock = namespace ? io('/' + namespace) : io.connect();

	// React on 'new call' events
	sock.on('new call', function (data) {
		var from = data.from;
		var to = data.to;
		var direction = data.direction;
		var callId = data.callId;

		ringPhone();

		updatePhoneNumberBox(from);

		appendLogRow(from, to, direction, callId);
	});

    sock.on('answer', function (data) {
        var callId = data.callId;

        updateCallStatus(callId, "Abgenommen");
    });

	sock.on('end call', function (data) {
		var callId = data.callId;
		var cause = data.cause;

		updateCallStatus(callId, cause);
	});
});
