var express = require('express');
var router = express.Router();
var Crawler = require("simplecrawler");
var cheerio = require('cheerio');
var fs = require('fs');
var config = require('../config.js');
// var request = require('request');
// var url = require('url');
// var parseRobots = require("robots-parser");

var xcfParser = require('../parsers/xcfParser');

/* GET users listing. */
router.get('/', function(req, res, next) {

  var IP_FileName = "ip_list.txt";
  var IP_FilePath = "./resources/"
  var IP_File = IP_FilePath + IP_FileName;

  var IP_Data = fs.readFileSync(IP_File).toString();
  var IP_AddrLine = IP_Data.split('\n');

  var IP_POOL = [];
  for (var i = 0; i < IP_AddrLine.length - 1; i++) {
    var element = IP_AddrLine[i].split(':');
    IP_POOL.push({
      "ip": element[0].trim(),
      "port": parseInt(element[1])
    });
  }

  // IDEA: Consider using `random-useragent` module
  var UserAgent_FileName = "user-agent_list.txt";
  var UserAgent_FilePath = "./resources/"
  var UserAgent_File = UserAgent_FilePath + UserAgent_FileName;

  var UserAgent_Data = fs.readFileSync(UserAgent_File).toString();
  var UserAgent_Line = UserAgent_Data.split('\n');

  var USER_AGENT_POOL = [];
  for (var i = 0; i < UserAgent_Line.length - 1; i++) {
    USER_AGENT_POOL.push(UserAgent_Line[i].trim());
  }

  var targetUrl = config.targetUrl;
  var initialPort = config.initialPort;
  var initialPath = config.initialPath;

  var crawler = new Crawler(targetUrl, initialPath, initialPort);

  crawler.useProxy = true;
  crawler.interval = 2000;
  crawler.maxConcurrency = 2;
  crawler.maxDepth = 4;
  crawler.acceptCookies = false;

  rotateIP();
  rotateUserAgent();

  var conditionID_fileType = crawler.addFetchCondition(function(parsedURL) {
    return !parsedURL.path.match(/(\.pdf$|\.png$|\.jpg$|\.js$)/i);
  });

  var conditionID_pathType = crawler.addFetchCondition(function(parsedURL) {
    return parsedURL.path.match(/(\/recipe\/|\/category\/)/i);
  });

  setInterval(queueStats, 60000);

  function queueStats() {
    console.log("-----------------------------------------");
    console.log("The maximum request latency was %dms.",
      crawler.queue.max("requestLatency"));
    console.log("The minimum download time was %dms.",
      crawler.queue.min("downloadTime"));
    console.log("The average resource size received is %d bytes.",
      crawler.queue.avg("actualDataSize"));
    console.log("-----------------------------------------");
  }

  setInterval(rotateIP, 3000);

  function rotateIP() {
    var rand = parseInt(Math.random() * IP_POOL.length);
    var ipIndex = Math.min(Math.max(0, rand), IP_POOL.length -1);
    crawler.proxyHostname = IP_POOL[ipIndex].ip;
    crawler.proxyPort = IP_POOL[ipIndex].port;
  }

  setInterval(rotateUserAgent, 1000);

  function rotateUserAgent() {
    var rand = parseInt(Math.random() * USER_AGENT_POOL.length);
    var uaIndex = Math.min(Math.max(0, rand), USER_AGENT_POOL.length -1);
    crawler.userAgent = USER_AGENT_POOL[uaIndex];
  }

  // Crawler event handlers

  crawler.on("crawlstart", function() {
    console.log("Crawl starting");
  });

  crawler.on("fetchstart", function(queueItem) {
    console.log("fetchStart", queueItem.url);
    console.log(crawler.userAgent);
    console.log(crawler.proxyHostname + ":" + crawler.proxyPort);
  });

  crawler.on("fetcherror", function(queueItem, response) {
    console.log("queueItem.url: " + queueItem.url);
    console.log("fetcherror");
    // TODO: Better Re-try Strategy
    crawler.queueURL(queueItem.url);
  });

  crawler.on("fetchdataerror", function(queueItem, response) {
    console.log("queueItem.url: " + queueItem.url);
    console.log("fetchdataerror");
    // TODO: Better Re-try Strategy
    crawler.queueURL(queueItem.url);
  });

  crawler.on("fetchcomplete", function(queueItem, responseBuffer, response) {
    console.log("Completed fetching resource:", queueItem.url);
    console.log("Received %s (%d bytes)", queueItem.url, responseBuffer.length);
    console.log("Resource of type %s", response.headers['content-type']);

    // Do something with the data in responseBuffer
    if (response.headers['content-type'].indexOf("text/html") > -1) {
      // Content Parse and Save
      xcfParser(queueItem, responseBuffer);
    }

  });

  crawler.on("complete", function() {
      console.log("Finished!");
  });

  crawler.start();

  res.send('respond with a resource');
});

module.exports = router;
