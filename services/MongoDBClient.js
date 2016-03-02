/* A singleton client to Cloudant database */
var mongoose = require('mongoose');
var config = require('../config');

var client = false;
var dbURI =
  config.mongodb.dburl ||
  process.env.MONGOLAB_URI ||
  'mongodb://localhost:27017/pikachu';

var MongoDBClient = function() {};

MongoDBClient.init = function(callback) {

  mongoose.connect(dbURI, function(err, res) {
    if (err) {
      console.log('Error connecting to MongoDB' +
      ' account %s: %s', config.mongodb.username, err.message);
      callback(err);
      return;
    } else {
      console.log("connected to MongoDB");
      client = true;
      callback(null, mongoose);
    }

  })
}

MongoDBClient.getInstance = function(callback) {
  if (client) {
    callback(null, mongoose);
  } else {
    MongoDBClient.init(callback)
  }
};

exports.getInstance = MongoDBClient.getInstance;
