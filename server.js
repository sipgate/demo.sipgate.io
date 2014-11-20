// Get port from environment or use port 3000
var port = process.env.PORT || 3000;

// Initialize express, socket.io and node-phonenumber
var express = require('express');
var app = express();
var server = app.listen(port);
var io = require('socket.io')(server);
var phone = require('node-phonenumber');
var phoneUtil = phone.PhoneNumberUtil.getInstance();
var xml = require('xml');

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

	// Send call to voicemail
	response.header('Content-Type', 'application/xml');
	response.send(
		xml({ Response: [
			{ Dial: [
				{ Voicemail: null }
			] },
		] })
	);

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
	};

	// Get POST parameters
	var from = formatNumber(request.body.from);
	var to = formatNumber(request.body.to);
	var direction = request.body.direction == "in" ? "Eingehend" : "Ausgehend";

	// Send 'from', 'to' and 'direction' to all connected socket.io clients
	io.sockets.emit('new call', {
		from: from,
		to: to,
		direction: direction,
	});
});
