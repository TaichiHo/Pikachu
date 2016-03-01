var mongoose = require('mongoose');

var categorySchema = new mongoose.Schema({
  _id: { type: String },
  name: {
    type: String,
    reqired: true
  },
  recipes: [{
    type: String
  }]
});

var recipeSchema = new mongoose.Schema({
  _id: { type: String },
  name: {
    type: String,
    reqired: true
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
  ingredients: [{
    type: String
  }],
  categories: [{
    type: String
  }]
});

module.exports.categorySchema = categorySchema;
module.exports.recipeSchema = recipeSchema;
