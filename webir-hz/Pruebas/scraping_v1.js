var _ = require("underscore");
var request = require("request");
var cheerio = require("cheerio");
var prompt = require("prompt");
var exec = require('child_process').exec;

prompt.start();
prompt.get(["query"], function (err, result) {
    if(!err) {
        var encodeQuery = encodeURIComponent(result.query + " 720p");
        var url = 'http://thepiratebay.sx/search/' + encodeQuery + '/0/7/0';
        var options = {
            url : url,
            headers : {
                'User-Agent' : 'Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.8.1.13) Gecko/20080311 Firefox/2.0.0.13'
            }
        };

        request(options, function (error, response, body) {
            $ = cheerio.load(body);

            var titles = $('.detName a').map(function (i, a) {
                return a.attribs.title;
            });

            var links = $('#searchResult a[title="Download this torrent using magnet"]').map(function (i, magnet) {
                return magnet.attribs.href;
            });

            _.each(titles, function (title, i) {
                console.log(i + ") " + title);
            });

            prompt.get(['index'], function (err, result) {
                if(!err) {
                    _.each(result.index.split(" "), function (index) {
                        var cmd = 'ssh imac "open /Applications/uTorrent.app ' + links[index] + '"';
                        console.log(cmd);
                        exec(cmd);
                    });
                }
            });

        });
    }
});