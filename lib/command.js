'use strict';

var config = require('../config/index');
var base = require('./base');
var enums = require('./enum');
var watson = require('../connector/ibm.watson');
var Promise = require('bluebird');
var Redis = require('ioredis');
var redis = new Redis({ keyPrefix: config.PREFIX });
var WebClient = require('@slack/client').WebClient;
var web = new WebClient(config.BOT_TOKEN);

// Increment User Motivation Point
exports.incPointStat = function (type, argv, value) {
    redis.hincrby(
        base.generateRedisStatsKey(type, argv.team),
        base.generateRedisHashKey(argv.moood, argv.user),
        value
    );
};

// CMD: Stats
exports.stats = function (argv) {
    var mooodHashKeys = base.generateRedisHashKeys(enums.mooodTypes, argv.user);

    return new Promise(function (resolve, reject) {
        if (argv.subcmd === 'me') {
            return redis.hmget(base.generateRedisStatsKey(enums.STAT_MOOOD, argv.team), mooodHashKeys, function (err, mooodStats) {
                if (!!err) reject('no result!');
                var collectMooodStats = base.collectStats(mooodHashKeys, mooodStats);
                return resolve(base.generateStatsText(collectMooodStats));
            });
        } else if (argv.subcmd === 'today') {
            return redis.hgetall(base.generateRedisStatsKey(enums.STAT_MOOOD, argv.team), function (err, mooodStats) {
                if (!!err) reject('no result!');
                var collectMooodStats = base.collectStats(Object.keys(mooodStats), Object.values(mooodStats));
                return resolve(base.generateStatsText(collectMooodStats));
            });
        }
    });
};

// By mood message
exports.getRandomMoodMessage = function (mood) {
    var smilesList = enums.mooodSmilesList[mood];
    return smilesList[base.randomNumber(smilesList.length)];
};

// CMD: Mood
exports.moood = function (argv, user, senders) {
    var self = this;
    return new Promise(function(resolve, reject) {
        if(argv.greet && argv.greet.length > 0) {
            var opts = {
                "as_user": true,
                "attachments": [
                    {
                        "color": "#36a64f",
                        "text": argv.msg + ' from _' + user.real_name + '_ :clap:',
                        "mrkdwn_in": [
                            "text"
                        ]
                    }
                ]
            };
            self.sendDmChannel(senders, ' ', opts);
            return resolve(':+1:');
        } else {
            if(argv.msg.length >= config.WATSON_MSG_MIN && argv.msg.length <= config.WATSON_MSG_MAX) {
                // Moood Message
                return watson.checkTextMood(argv.msg).then(function (result) {
                    argv.moood = watson.fetchResponse(result);
                    if(enums.mooodTypes.hasOwnProperty(argv.moood)) {
                        self.incPointStat(enums.STAT_MOOOD, argv, enums.mooodTypes[argv.moood]);
                        return resolve(self.getRandomMoodMessage(argv.moood));
                    }
                    return resolve(':slightly_smiling_face:');
                });
            }
        }

        return reject('Msg length is too short!');
    });
};

// Send DM Command: Use Only Real User
//
// @params
// - opts (attributes ..)
exports.sendDmUser = function (senders, msg, opts) {
    if(!!senders && Object.keys(senders).length > 0) {
        for (var i in senders) {
            web.dm.open(senders[i].id, function(d, e) {
                if (typeof opts === "undefined"){
                    opts = {as_user:true}; // Bot sends message as a real user.
                }
                web.chat.postMessage(e.channel.id,msg,opts, function(f, g){
                    web.dm.close();
                });
            });
        }
    }
};

// Send DM Command: Use Only Channel
//
// @params
// - opts (attributes ..)
exports.sendDmChannel = function (senders, msg, opts) {
    if(!!senders && Object.keys(senders).length > 0) {
        for (var i in senders) {
            if (typeof opts === "undefined"){
                opts = {as_user:true}; // Bot sends message as a real user.
            }
            web.chat.postMessage(senders[i].id,msg,opts, function(f, g){
                // web.dm.close();
            });
        }
    }
};