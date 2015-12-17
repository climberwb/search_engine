'use strict';
var elasticsearch = require('elasticsearch');
var async = require('async');
var _ = require('lodash');

var express = require('express');


var client = new elasticsearch.Client({
  host: 'localhost:9200',
  log: 'trace'
});

// Drop Index

exports.dropIndexImis = function dropIndexImis(callback) {
  console.log('>>>>>>>>>> dropIndexImis');
  client.indices.delete({ index: 'imis' }, function() {
    console.log('<< dropIndexImis');
    callback();
  });
}

// Create index

exports.createIndexImis = function createIndexImis(callback) {
  console.log('>>>>>>>>>> createIndexImis');
  client.indices.create({ index: 'imis' }, function(res,err) {
    console.log('<< createIndexImis');
    callback(res);
  });
}

// Define mapping explicitely

exports.updateIndexMapping = function updateIndexMapping(callback) {
  console.log('>>>>>>>>>> updateIndexMapping');

  client.indices.putMapping({
    index: 'imis',
    type: 'pdf',
    body: {
      post: {
        properties: {
          title: { type: 'string', store: true/*, index: 'not_analyzed'*/ },
          content: { type: 'string', store: true },
          date: { type: 'string', store: true },
          status: { type: 'string', store: true }
        }
      }
    }
  }, function(err,res) {
    console.log('<< updateIndexMapping');
    callback(res);
  });
}

// Bulk imports
exports.indexImisPdf = function indexImisPdf(pdfHash,callback) {
  console.log('>>>>>>>>>> indexImisPdf');
  client.index({
    index: 'imis',
    type: 'pdf',
    id:pdfHash._id,
    refresh: true,
    body: {
      title: pdfHash.title,
      content: pdfHash.content,
      date: pdfHash.date,
      status: pdfHash.status
    }
  }, function(err, res) {
    // ...
    console.log('<< indexImisPdf');
    callback(res);
  });
}

// search for pdf

exports.searchImisPdfByTitle = function searchImisPdfByTitle(searchQuery,callback) {
  console.log('>>>>>>>>>> searchBlogPost: '+searchQuery.title);
  client.search({
    index: 'imis',
    type: 'pdf',
    size: 10, // increase or decrease this for allowed search results per query 
    body: {
      query: {
        match: {
          title: searchQuery.title
        }
      }
    }
  }).then(function(resp) {
    console.log('<< searchImisPdf');
    var hits = resp.hits.hits;
    console.log('hits = '+JSON.stringify(hits));
    callback(resp);
  }, function(err) {
    console.trace(err.message);
  });
}

exports.searchImisPdfByContent = function searchImisPdfByContent(searchQuery,callback) {
  console.log('>>>>>>>>>> searchBlogPost: '+searchQuery.content);
  client.search({
    index: 'imis',
    type: 'pdf',
    size: 10, // increase or decrease this for allowed search results per query 
    body: {
      query: {
        match: {
          content: searchQuery.content
        }
      }
    }
  }).then(function(resp) {
    console.log('<< searchImisPdf');
    var hits = resp.hits.hits;
    //console.log('hits = '+JSON.stringify(hits));
    
    callback(hits);
  }, function(err) {
    console.trace(err.message);
  });
}

exports.getAllImisPdfs = function getAllImisPdfs(callback) {
  console.log('>>>>>>>>>> searchAllBlogPosts');
  client.search({
    index: 'imis',
    type: 'pdf',
    body: {
      query: {
        match_all: {
        }
      }
    }
  }).then(function(resp) {
    console.log('<< searchAllBlogPosts');
    var hits = resp.hits.hits;
    callback(hits);
  }, function(err) {
    console.trace(err.message);
  });
}
///////////// MY TEST FUNCTION

function searchImisPdf(content,callback) {
 // console.log('>>>>>>>>>> searchBlogPost: '+searchQuery.title);
  client.search({
    index: 'imis',
    type: 'pdf',
    size: 10, // increase or decrease this for allowed search results per query 
    body: {
      query: {
        match: {
          content: content
        }
      }
    }
  }).then(function(resp) {
    console.log('<< searchImisPdf');
    var hits = resp.hits.hits;
   // console.log('hits = '+JSON.stringify(resp));
    callback(hits[0]);
  }, function(err) {
    console.trace(err.message);
  });
}
