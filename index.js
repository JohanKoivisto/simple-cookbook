const fs = require("fs");
//const http = require("http");
const url = require("url");


var http = require('http');
 http.createServer(function (req, res) {
    console.log("Server started on port 8080")
   res.writeHead(200, {'Content-Type': 'text/html'});
   res.end('Hello World!');
 }).listen(8080);