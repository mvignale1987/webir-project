var Crawler = require("simplecrawler");
var crawler = new Crawler("montevideo.com.uy", "/", 80);

crawler.on("crawlstart", function() {
    console.log("Crawl starting");
});

crawler.on("fetchstart", function(queueItem) {
    console.log("fetchStart", queueItem);
});

crawler.on("fetchcomplete", function(queueItem) {
    console.log("fetchcomplete", queueItem);
});

crawler.on("complete", function() {
    console.log("Finished!");
});

crawler.start();
