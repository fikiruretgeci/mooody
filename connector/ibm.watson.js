'use strict';

var config = require('../config/index');
var Promise = require('bluebird');
var request = require('request');

/**
 * Sending Slack Message IBM Watson - Natural Language Understanding
 * URL : https://www.ibm.com/watson/developercloud/natural-language-understanding/api/v1/#post-analyze
 * */
exports.checkTextMood = function (text) {
    var parameters = {
        'text': text,
        'clean': true,
        'features': {
            'entities': {
                'emotion': true,
                'sentiment': true,
                'limit': 2
            },
            'keywords': {
                'emotion': true,
                'sentiment': true,
                'limit': 2
            }
        }
    };

    return new Promise(function(resolve, reject) {
        var options = {
            method: 'post',
            body: parameters,
            json: true,
            url: config.WATSON_URL + '?version=' + config.WATSON_VERSION,
            auth: {
                'user': config.WATSON_USERNAME,
                'pass': config.WATSON_PASSWORD
            },
            headers: {
                'Content-Type': 'application/json'
            }
        };

        request(options, function (err, res, body) {
            if (err) return reject(err);
            return resolve(body);
        });

    });
};

/**
 * Fetch Watson Result
 * Find highest keyword emotion
 * */
exports.fetchResponse = function (response) {
    var list = {};
    list['joy'] = list['sadness'] = list['fear'] = list['disgust'] = list['anger'] = 0;
    for (var i in response.keywords){
        list['joy'] += response.keywords[i].emotion.joy;
        list['sadness'] += response.keywords[i].emotion.sadness;
        list['fear'] += response.keywords[i].emotion.fear;
        list['disgust'] += response.keywords[i].emotion.disgust;
        list['anger'] += response.keywords[i].emotion.anger;
    }
    // Emotion Rank Sort A-Z
    var keysSorted = Object.keys(list).sort(function(a,b){return list[a]-list[b]});
    // Get Last Element
    return keysSorted[keysSorted.length - 1];
};