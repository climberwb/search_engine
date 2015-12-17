'use strict'

var SE = require('../../../model/elastic/imis/pdf.js');
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
//TODO make routes from SE


router.post('/pdfs', jsonParser, function(req, res) {
 //console.log('pdfs myBody' + JSON.stringify(req.query));
 SE.indexImisPdf(req.query, function(pdf) {
  console.log(pdf);
  res.status(201).json(pdf);
 }, function(err) {
  console.log(err);
  res.status(400).json(err);
 })
});

router.get('/pdf', function(req, res) {
 //console.log("myBody: " + JSON.stringify(req.query));
 console.log("query cont-"+req.query.content);
 if(req.query.content!== undefined){
  SE.searchImisPdfByContent(req.query, function(pdf) {
   var results = {"results":pdf}
   console.log(results);
   res.status(201).json(pdf);
  }, function(err) {
   console.log(err);
   res.status(400).json(err);
  })
 }else if(req.query.title !==undefined){
  SE.searchImisPdfByTitle(req.query, function(pdf) {
   res.status(201).json(pdf);
  }, function(err) {
   console.log(err);
   res.status(400).json(err);
  })
 }
})

router.get('/pdfs', function(req, res) {
 console.log('inside get pdfs');
 SE.getAllImisPdfs( function(pdfs) {
   res.status(201).json(pdfs);
   console.log(pdfs)
  }, function(err) {
   console.log(err);
   res.status(400).json(err);
 })
})



module.exports = router;