'use strict';

var elasticsearch = require('elasticsearch');
var async = require('async');
var _ = require('lodash');

var client = new elasticsearch.Client({
  host: 'localhost:9200',
  log: 'trace'
});


// Drop index

function dropIndexBlog(callback) {
  console.log('>>>>>>>>>> dropIndexBlog');
  client.indices.delete({ index: 'blog' }, function() {
    console.log('<< dropIndexBlog');
    callback();
  });
}

// Create index

function createIndexBlog(callback) {
  console.log('>>>>>>>>>> createIndexBlog');
  client.indices.create({ index: 'blog' }, function() {
    console.log('<< createIndexBlog');
    callback();
  });
}

// Define mapping explicitely

function updateIndexMapping(callback) {
  console.log('>>>>>>>>>> updateIndexMapping');

  client.indices.putMapping({
    index: 'blog',
    type: 'post',
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
  }, function(response) {
    console.log('<< updateIndexMapping');
    callback();
  });
}

function getIndexMapping(callback) {
  console.log('>>>>>>>>>> getIndexMapping');

  client.indices.getMapping({
    index: 'blog',
    type: 'post'
  }, function(response) {
    console.log('<< getIndexMapping');
    callback();
  });
}

// Indexing documents

function indexBlogPost(callback) {
  console.log('>>>>>>>>>> indexBlogPost');
  client.index({
    index: 'blog',
    type: 'post',
    id: 1,
    refresh: true,
    body: {
      title: 'JavaScript Everywhere!',
      content: 'It all started when...',
      date: '2013-12-17',
      status: 'active'
    }
  }, function(err, res) {
    // ...
    console.log('<< indexBlogPost');
    callback();
  });
}

// Bulk imports

function indexBlogPosts(callback) {
  console.log('>>>>>>>>>> indexBlogPosts');
  client.bulk({
    refresh: true,
    body: [
      // doc #2
      { index:  { _index: 'blog', _type: 'post', _id: 2 } },
      {
        title: 'ElasticSearch is cool',
        content: 'It all started when...',
        date: '2014-12-17',
        status: 'active'
      },
      // doc #3
      { index:  { _index: 'blog', _type: 'post', _id: 3 } },
      {
        title: 'Node is cool',
        content: 'It all started when...',
        date: '2012-12-17',
        status: 'draft'
      },
    ]
  }, function(err, res) {
    // ...
    console.log('<< indexBlogPosts');
    callback();
  });
}

// Searching documents

function searchAllBlogPosts(callback) {
  console.log('>>>>>>>>>> searchAllBlogPosts');
  client.search({
    index: 'blog',
    type: 'post',
    body: {
      query: {
        match_all: {
        }
      }
    }
  }).then(function(resp) {
    console.log('<< searchAllBlogPosts');
    var hits = resp.hits.hits;
    console.log('hits = '+JSON.stringify(hits));
    callback();
  }, function(err) {
    console.trace(err.message);
  });
}

function searchBlogPost(callback) {
  console.log('>>>>>>>>>> searchBlogPost');
  client.search({
    index: 'blog',
    type: 'post',
    body: {
      query: {
        match: {
          title: 'elasticsearch'
        }
      }
    }
  }).then(function(resp) {
    console.log('<< searchBlogPost');
    var hits = resp.hits.hits;
    console.log('hits = '+JSON.stringify(hits));
    callback();
  }, function(err) {
    console.trace(err.message);
  });
}

function searchBlogPostWithStatus(callback) {
  console.log('>>>>>>>>>> searchBlogPostWithStatus');
  client.search({
    index: 'blog',
    type: 'post',
    body: {
      query: {
        filtered: {
          query: {
            match: {
              title: 'elasticsearch'
            }
          },
          filter: {
            term: {
              status: 'draft'
            }
          }
        }
      }
    }
  }).then(function(resp) {
    console.log('<< searchBlogPostWithStatus');
    var hits = resp.hits.hits;
    console.log('hits = '+JSON.stringify(hits));
    callback();
  }, function(err) {
    console.trace(err.message);
  });
}

// Executing actions

async.series([
  dropIndexBlog,
  createIndexBlog,
  updateIndexMapping,
  //getIndexMapping,
  indexBlogPost,
  indexBlogPosts,
  searchAllBlogPosts,
  searchBlogPost/*,
  searchBlogPostWithStatus*/
], function(err) {
    console.log('End');
  });
