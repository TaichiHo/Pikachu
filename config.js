/**
 * App configuration
 */

var config = {};

config.targetUrl = "www.xiachufang.com";
config.initialPort = 80;
config.initialPath = "/";

config.mongodb = {};

// VCAP_SERVICES
if (process.env.VCAP_SERVICES) {
  var vcapServices = JSON.parse(process.env.VCAP_SERVICES);

  if (vcapServices['user-provided'] != null) {
    var userProvidedServices = vcapServices['user-provided'];

    for (var i = 0; i < userProvidedServices.length; i++) {
      if (userProvidedServices[i].name == 'mLab') {
        config.mongodb.dburl = userProvidedServices[i].credentials.mongodburi;
        console.log("Using mLab MongoDB");
      }
    }
  }
}

if (!config.mongodb.dburl) {
  config.mongodb.dburl = 'mongodb://localhost:27017/pikachu'
}

module.exports = config;
