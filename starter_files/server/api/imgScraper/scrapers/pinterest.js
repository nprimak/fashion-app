'use strict';

var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');

exports.list = function(url, cb) {
    request(url, function(error, response, body){
        if(error) {
            cb({
                error: error
            })
        }
        if(!error) {
            var $ = cheerio.load(body);
            var $url = url;
            var $img = $("meta[property='og:image']").attr("content");//get from pinterest
            var $desc = $("meta[property='og:description']").attr("content"); //description from pinterest
            console.log($img + ' pin url');

            var pin = {
                img: $img,
                url: $url,
                desc: $desc
            }

            // respond with the final JSON object
            cb(pin);

        }
    })
}