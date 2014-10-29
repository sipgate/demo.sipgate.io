// Get port from environment or use port 3000
var port = process.env.PORT || 3000;

// Initialize express, socket.io and node-phonenumber
var express = require('express');
var app = express();
var server = app.listen(port);
var io = require('socket.io')(server);
var phone = require('node-phonenumber');
var phoneUtil = phone.PhoneNumberUtil.getInstance();

// Set ejs as template engine
app.set('view engine', 'ejs');

// Serve static files from 'public/' folder
app.use(express.static(__dirname + '/public'));

// Initialize express body-parser middleware
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));

// Serve 'index.html'
app.get("/", function(req, res) {
	res.render('index');
});

// Process API POST requests
app.post("/", function(request, response) {

	// Randomly decide if we want to reject, return a busy signal or let the call go through to our voicemail
	var action = Math.floor(Math.random() * 3);
	var responseText = "So Long, and Thanks for All the Fish!";
	switch(action) {
		case 0:		// Voicemail
			responseText = '<?xml version="1.0" encoding="UTF-8"?><Response><Dial><Voicemail /></Dial></Response>';
			break;
		case 1:		// Reject
			responseText = '<?xml version="1.0" encoding="UTF-8"?><Response><Reject /></Response>';
			break;
		case 2:		// Busy
			responseText = '<?xml version="1.0" encoding="UTF-8"?><Response><Reject reason="busy"/></Response>';
			break;
	}

	response.header('Content-Type','application/xml').send(responseText);

	// Parse and format numbers
	var formatNumber = function(number) {
		if (number.match("anonymous")) {
			return "Anonym";
		}

		var parsedNumber = phoneUtil.parse("+" + number, "DE");

		var format = phone.PhoneNumberFormat.INTERNATIONAL;
		if (parsedNumber.getCountryCode() == 49) {
			format = phone.PhoneNumberFormat.NATIONAL;
		}

		return phoneUtil.format(parsedNumber, format).replace(/...$/, 'xxx');
	}

	var from = formatNumber(request.body.from);
	var to = formatNumber(request.body.to);

	// Send 'from' and 'to' to all connected socket.io clients
	io.sockets.emit('new call', {
		from: from,
		to: to,
		action: action
	});
});
