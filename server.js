var async = require('async');
var _ = require('lodash');
var ES = require('./model/elastic/imis/pdf.js');
var ESRoutes = require('./controller/elastic/imis/pdf.js')
var bodyParser = require('body-parser');
var express = require('express');
var http = require('http');

var app = express();

// uncomment to wipe out development es instance
// async.series([
//   ES.dropIndexImis,
//   ES.createIndexImis,
//   ES.updateIndexMapping,
//   //getIndexMapping,
// ], function(err) {
//     console.log('End');
//   });
  
app.use(bodyParser.json());

var server = http.Server(app);

app.use('/', ESRoutes);

app.use('*', function(req,res){
    res.status(404).json({message:'Not Found'});
});
 console.log('5');

server.listen(8080, function(){
    console.log('Listening on port 8080');
});

exports.app=app;




