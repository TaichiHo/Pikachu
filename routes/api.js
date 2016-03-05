var express = require('express');
var router = express.Router();
var QueryService = require('../services/QueryService');

/* GET home page. */
router.get('/search', function(req, res, next) {
  var response = {};
  if (req.query.q) {
    var q = req.query.q;
    QueryService.searchRecipe(q, function(err, docs) {
      if (err) {
        response.error = "Search failed";
        console.log(err.message);
      } else {
        response.docs = docs;
      }
      res.send(response);
    })
  } else {
    console.log(req.query.q);
    res.send({status: "OK"});
  }

});

module.exports = router;
