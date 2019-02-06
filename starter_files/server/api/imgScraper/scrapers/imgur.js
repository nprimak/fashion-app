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
            var $img = $("link[rel='image_src']").attr("href");//get from imgur
            var $desc = $("meta[property='og:title']").attr("content"); //description from imgur
            console.log($img + ' imgur url');

            var img = {
                img: $img,
                url: $url,
                desc: $desc
            }

            // respond with the final JSON object
            cb(img);

        }
    })
}