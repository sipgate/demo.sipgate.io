// Get port from environment or use port 7777
var port = process.env.PORT || 7777;

// Initialize express and socket.io
var express = require('express');
var app = express();
var server = app.listen(port);
var io = require('socket.io')(server);
var phone = require('node-phonenumber');
var phoneUtil = phone.PhoneNumberUtil.getInstance();

// Set ejs template engine
app.set('view engine', 'ejs');

// Serve static files from 'public/' folder
app.use(express.static(__dirname + '/public'));

// Initialize express body-parser middleware
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));

// Serve 'index.html'
app.get("/", function (req, res) {
	res.render('index');
});

// Process API POST requests
app.post("/", function (request, response) {
	// Send response to API
	response.send("So Long, and Thanks for All the Fish!");

	// Parse and format numbers
	var fromNumber = phoneUtil.parse("+" + request.body.from, "DE");
	var toNumber = phoneUtil.parse("+" + request.body.to, "DE");

	var format = phone.PhoneNumberFormat.INTERNATIONAL;
	if (fromNumber.getCountryCode() == 49) {
		format = phone.PhoneNumberFormat.NATIONAL;
	}

	var from = phoneUtil.format(fromNumber, format);
	var to = phoneUtil.format(toNumber, phone.PhoneNumberFormat.NATIONAL);

	// Send anonymous 'from' and 'to' to all connected socket.io clients
	io.sockets.emit('new call', {
		from: from.replace(/...$/, 'XXX'),
		to: to.replace(/...$/, 'XXX'),
	});
});
