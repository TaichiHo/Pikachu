var models = require('../db/models');

var Recipe = models.Recipe;
var Category = models.Category

// Utilize native node mongodb driver method
function searchRecipe(q, callback) {
  Recipe.collection.find({
    ingredients: q
  })
  .limit(100)
  .sort({
    likes: -1,
    rating: -1,
    cooked: -1,
    dishes: -1
  })
  .toArray(function(err, docs) {
    if (err) {
      return callback(err, null);
    }
    callback(null, docs);
  });
}

exports.searchRecipe = searchRecipe;
