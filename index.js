 var validator = require('validator');
 var express = require("express");
 var app = express();

var Datastore = require('nedb')
  , db = new Datastore({ filename: 'private/database', autoload: true });

db.ensureIndex({ fieldName: 'original_url', unique: true }, function (err) {
 if(err) return err;
});

function syncFind(id){
            var result
    db.find({ lid: parseInt(id) }, function (err, url) {
           result = url[0].original_url;
     });
           while(result === undefined) {
    require('deasync').runLoopOnce();
  }
  return result;    
}

function syncCount(){
            var counter
            db.count({}, function (err, count) {
                   counter = count;
            });
           while(counter === undefined) {
    require('deasync').runLoopOnce();
  }
  return counter;    
}
 /* serves main page */
 app.get("/", function(req, res) {
    res.sendfile(__dirname + '/public/index.html')
 });

 app.get("/:id", function(req, res) {
    var id = req.params.id;
   

    var result = syncFind(id);
    res.redirect(result)
 });
 
 
 app.get("/new/:url*", function(req, res) {
     var url = req.params.url + req.params[0];
     var counter = syncCount();

     
     if(validator.isURL(url)){
          
           var i = counter++;
           var shorty = req.protocol + '://' + req.host + '/' + i;
           var doc = { 
                     original_url: url
                   , short_url: shorty
                   , lid: i
                     };
          
           db.insert(doc, function (err) {   // Callback is optional
            // newDoc is the newly inserted document, including its _id
            if(err) return err;
            // newDoc has no key called notToBeSaved since its value was undefined
           });
          
           res.send({original_url:url, short_url: shorty});
     } else {
      res.send({"error":"URL invalid"});
     }
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