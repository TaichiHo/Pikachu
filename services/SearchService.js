var elasticsearch = require('elasticsearch');


// Reference:
// https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/quick-start.html

var client = new elasticsearch.Client({
  host: 'localhost:9200',
  log: 'trace'
});

client.ping({
  requestTimeout: 30000,

  // undocumented params are appended to the query string
  hello: "elasticsearch"
}, function (error) {
  if (error) {
    console.error('elasticsearch cluster is down!');
  } else {
    console.log('ElasticSearch: All is well');
  }
});

// https://www.elastic.co/guide/en/elasticsearch/reference/current/search-request-sort.html

function searchRecipe(q, callback) {

  client.search({
    index: 'pikachu',
    type: 'recipes',
    body: {
      query: {
        match: {
          name: q
        }
      }
    },
    sort : [
        { 'rating': "desc"},
        { 'likes': "desc" },
        { 'dishes': "desc" },
        { 'cooked': "desc"},
        {"_score": "desc"}
    ]
  }).then(function (res) {
      var hits = [];
      if (res && res.hits && res.hits.hits) {
        hits = res.hits.hits;
      }
      callback(null, hits);
  }, function (err) {
      console.trace(err.message);
      callback(err, null);
  });
}

exports.searchRecipe = searchRecipe;
