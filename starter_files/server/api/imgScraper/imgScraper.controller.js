'use strict';

var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');

var scrapers = {};

scrapers['pinterest'] = require('./scrapers/pinterest');
scrapers['imgur'] = require('./scrapers/imgur');

exports.scrape = function(req, res) {
    var url = req.body.url;
    var scraperToUse;

    if(url.indexOf('pinterest') > -1){
        scraperToUse = 'pinterest';
    } else if (url.indexOf('imgur') > -1) {
        scraperToUse = 'imgur';
    }else {
        console.log('Cannot locate scraper.');
    }

    scrapers[scraperToUse].list(url, function(data) {
        console.log('data from scraper', data);
        res.json(data);
    })
}