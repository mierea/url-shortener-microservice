 var express = require("express");
 var app = express();


 /* serves main page */
 app.get("/", function(req, res) {
    res.sendFile(__dirname + '/public/index.html')
 });

 app.get("/new/:url", function(req, res) {
     var url = encodeURIComponent(req.params.url);
    res.send({url:url});
 });

 app.get("/api/whoami/", function(req, res) {
   var ip = req.headers['x-forwarded-for'];
   var language = req.headers['accept-language'].substr(0, req.headers['accept-language'].indexOf(',')); ;
   var software = req.headers['user-agent'].substring(req.headers['user-agent'].indexOf("(")+1,req.headers['user-agent'].indexOf(")"));
   
   res.send({ipaddress: ip, language:language, software:software});
 });

 var port = process.env.PORT || 8080;
 app.listen(port, function() {
   console.log("Listening on " + port);
 });