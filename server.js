var http = require('http');
var express = require('express'),
    app = module.exports.app = express(),
    server = http.createServer(app),
    port = 3000;

app.use(express.static('./dist'));

server.listen(port);  //listen on port 8080
console.log("Listening on port " + port);