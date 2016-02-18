var cheerio = require('cheerio');
var fs = require('fs');

var xcfParser = function (queueItem, responseBuffer) {
  var $ = cheerio.load(responseBuffer);

  if (queueItem.url.match(/(\/category\/)/i)) {
    try {
      var category = {};
      category.id = queueItem.url.match(/\/category\/([0-9]*)/i)[1];
      category.name = $(".page-title").text().trim();
      category.recipes = [];

      $(".recipe-140-horizontal").find(".info")
        .find(".name").find("a").each(function(i, element){
        category.recipes.push(
          element.attribs['href'].match(/\/recipe\/([0-9]*)/i)[1]
        );
      });
      console.log(category);
      var categoryJSON = JSON.stringify(category) + "\n";
      fs.appendFile('./data/category.txt', categoryJSON, function(err) {
        if (err) {
          console.log(err);
        }
      });
    } catch (e) {
      console.log(e);
    }
  }

  // Fetch Recipe data
  if (queueItem.url.match(/(\/recipe\/)/i)) {
    try {
      var recipe = {};
      recipe.id = queueItem.url.match(/\/recipe\/([0-9]*)/i)[1];
      recipe.name = $(".page-title").text().trim();
      recipe.rating = parseFloat($(".score").find(".number").text());
      recipe.cooked = parseInt($(".cooked").find(".number").text());
      recipe.dishes = parseInt($(".recipe-dishes-title").find(".num").text());
      recipe.categories = [];
      $(".recipe-cats").find("a").each(function(i, e){
        recipe.categories.push(e.attribs.href.match(/\/category\/([0-9]*)/i)[1]); // TODO
      });
      console.log(recipe);
      var recipeJSON = JSON.stringify(recipe) + "\n";
      fs.appendFile('./data/recipe.txt', recipeJSON, function(err) {
        if (err) {
          console.log(err);
        }
      });
    } catch (e) {
      console.log(e);
    }
  }

}

module.exports = xcfParser;
