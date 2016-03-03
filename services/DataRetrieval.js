/**
 * Created by Taichi1 on 3/2/16.
 */

var Model = require('../db/models');

const CATEGORY = "category";
const RECIPE = "recipe";
const BOTH = "both";
module.exports.CATEGORY = CATEGORY;
module.exports.RECIPE = RECIPE;
module.exports.BOTH = BOTH;

module.exports.search = function (toSearchText, type) {
    "use strict";
    if (type != CATEGORY && type != RECIPE) {
        type = BOTH;
    }
    var rtn = {};
    var promiseCategory =
        Model.Category
            .find(
                {$text: {$search: toSearchText}},
                {score: {$meta: "textScore"}}
            )
            .sort({score: {$meta: 'textScore'}})
            .exec();
    var promiseRecipe =
        Model.Category
            .find(
                {$text: {$search: toSearchText}},
                {score: {$meta: "textScore"}}
            )
            .sort({score: {$meta: 'textScore'}})
            .exec();

    if (type == CATEGORY) {
        promiseRecipe = new Promise();
    } else if (type == RECIPE) {
        promiseCategory = new Promise();
    }

    console.log("Search Type: " + type);

    console.log("To Search Text is: " + toSearchText);
    return promiseRecipe
        .then(function (results) {
            console.log("Recipe Result: " + results);
            if (!results && results.length > 0) {
                rtn.recipe = results;
            }
            return promiseCategory;
        })
        .then(function (results) {
            console.log("Category Result: " + results);
            if (!results && results.length > 0) {
                rtn.category = results;
            }
            return Promise.resolve(rtn);
        });
};

