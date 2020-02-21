// Get port from environment or use port 3000
var port = process.env.PORT || 3000;

// Initialize express, socket.io and node-phonenumber
var express = require("express");
var app = express();
var server = app.listen(port);
var io = require("socket.io")(server);
var phone = require("node-phonenumber");
var phoneUtil = phone.PhoneNumberUtil.getInstance();
var xml = require("xml");

// Set ejs as template engine
app.set("view engine", "ejs");

// Serve static files from 'public/' folder
app.use(express.static(__dirname + "/public"));

// Initialize express body-parser middleware
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));

// Serve 'index.html'
app.get("/", function(req, res) {
  res.render("index");
});

// Serve 'connect.html'
app.get("/connect", function(req, res) {
  var namespace = "demo" + Math.random();

  res.render("connect", {
    namespace: namespace,
    url: "https://" + req.headers.host,
    isSuccess: false
  });
});

app.get("/success", function(req, res) {
  var namespace = req.query.token;

  res.render("connect", {
    namespace: namespace,
    isSuccess: true
  });

  io.of("/" + namespace).on("connection", function(socket) {
    console.log("connected");
  });
});

// Process API POST requests
app.post("/", function(request, response) {
  var namespace = request.query.token;
  var socket = namespace ? io.of("/" + namespace) : io.sockets;

  if (request.body.event == "newCall") {
    // Send call to voicemail
    response.header("Content-Type", "application/xml");
    response.send(
      xml({
        Response: [
          {
            _attr: {
              onAnswer:
                "https://" +
                request.headers.host +
                (namespace ? "?token=" + namespace : ""),
              onHangup:
                "https://" +
                request.headers.host +
                (namespace ? "?token=" + namespace : "")
            }
          },
          namespace ? {} : { Dial: [{ Voicemail: null }] }
        ]
      })
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

      return phoneUtil.format(parsedNumber, format).replace(/...$/, "xxx");
    };

    // Get POST parameters
    var from = formatNumber(request.body.from);
    var to = formatNumber(request.body.to);
    var direction = request.body.direction == "in" ? "Eingehend" : "Ausgehend";

    // Send 'from', 'to' and 'direction' to all connected socket.io clients
    socket.emit("new call", {
      from: from,
      to: to,
      direction: direction,
      callId: request.body.callId
    });
  } else if (request.body.event == "answer") {
    response.send();

    socket.emit("answer", {
      callId: request.body.callId
    });
  } else if (request.body.event == "hangup") {
    response.send();

    var getCause = function(cause) {
      switch (cause) {
        case "busy":
          return "Besetzt";
        case "normalClearing":
          return "Aufgelegt";
        case "cancel":
          return "Abgebrochen";
        case "noAnswer":
          return "Abgewiesen";
        default:
          return "Beendet";
      }
    };

    var cause = getCause(request.body.cause);

    socket.emit("end call", {
      callId: request.body.callId,
      cause: cause
    });
  }
});
