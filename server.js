var entries = require('./entries.js');

var express = require('express');


var app = express();
app.use('/static', express.static('build'));

app.get('/', function(req, res){
	req.accepts('application/json');
	
	res.set('Access-Control-Allow-Origin', "*");
	
	res.send(entries);
});

app.listen(8080, function() {
	console.log("Running on port ", 8080);
});

console.log(entries.data.length);