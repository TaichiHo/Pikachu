/**
 * Created by Taichi1 on 3/2/16.
 */

var express = require('express');
var router = express.Router();

var DataRetrieval = require('../services/DataRetrieval');


/* Search Results */
router.get('/', function (req, res, next) {

    var toSearchText = "家常";
    DataRetrieval
        .search(toSearchText)
        .then(function(results) {
            "use strict";
            var resultsJson = JSON.stringify(results);
            res.send(resultsJson);
        });

});

module.exports = router;