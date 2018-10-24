var fs = require("fs");
var path = require("path");
let dataString = fs.readFileSync(path.join(__dirname, "../src/data.json"));
var entries = JSON.parse(dataString);
var toSend = {"data":entries};

var express = require('express');

var app = express();

app.get('/', function(req, res) {
	req.accepts('application/json');
	res.set('Access-Control-Allow-Origin', "*");
	res.send(toSend);
});

app.listen(8080, function() {
	console.log("Running on port ", 8080);
});

console.log(entries.length);
