var express = require('express');
var router = express.Router();
var QueryService = require('../services/QueryService');
var SearchService = require('../services/SearchService');

/* GET search recipes v1. */
router.get('/v1/search', function(req, res, next) {
  var response = {};
  if (req.query.q) {
    var q = req.query.q;
    console.log("Search term: " + q);

    QueryService.searchRecipe(q, function(err, docs) {
      if (err) {
        response.error = "Search failed";
        console.log(err.message);
      } else {
        response.docs = docs;
        response.length = docs.length;
      }
      res.send(response);
    })
  } else {
    console.log(req.query.q);
    res.send({status: "OK"});
  }
});

/* GET search recipes v2. */
router.get('/v2/search', function(req, res, next) {
  var response = {};
  if (req.query.q) {
    var q = req.query.q;
    console.log("Search term: " + q);

    SearchService.searchRecipe(q, function(err, docs) {
      if (err) {
        response.error = "Search failed";
        console.log(err.message);
      } else {
        response.docs = docs;
        response.length = docs.length;
      }
      res.send(response);
    })
  } else {
    console.log(req.query.q);
    res.send({status: "OK"});
  }
});

module.exports = router;
