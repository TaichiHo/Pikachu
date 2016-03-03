var mongoose = require('mongoose');

var categorySchema = new mongoose.Schema({
    _id: {type: String},
    name: {
        type: String,
        required: true
    },
    recipes: [{
        type: String
    }]
});

// http://schema.org/Recipe
var recipeSchema = new mongoose.Schema({
    _id: {type: String},
    name: {
        type: String,
        required: true
    },
    image: {
        type: String
    },
    rating: {
        type: Number
    },
    cooked: {
        type: Number
    },
    dishes: {
        type: Number
    },
    likes: {
        type: Number
    },
    comments: {
        type: Number
    },
    dateCreated: {
        type: String
    },
    ingredients: [{
        type: String,
        index: true
    }],
    categories: [{
        type: String
    }]
});
categorySchema.index({name: 'text'}, {default_language: "chinese"});
recipeSchema.index({name: 'text', ingredients: 'text'},  {default_language: "chinese"});

// initialize promise
mongoose.Promise = global.Promise;

module.exports.categorySchema = categorySchema;
module.exports.recipeSchema = recipeSchema;
