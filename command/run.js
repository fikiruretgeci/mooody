"use strict";

// CRON: every day at 23:59 - when the current day ended, cron runs.
var config = require('../config/index');
var base = require('../lib/base');
var enums = require('../lib/enum');
var request = require('request');

// Redis
var Redis = require('ioredis');
var redis = new Redis({ keyPrefix: config.PREFIX });

// Redis Key RENAME
request(config.SLACK_API_URL + 'team.info?token=' + config.BOT_TOKEN, function (err, res, body) {
    if(err) {
        console.log(err);
    } else {
        var response = JSON.parse(body);
        if(response.ok) {
            console.log(response.team.name + ' stats renamed');
            redis.rename(base.generateRedisStatsKey(enums.STAT_MOOOD, response.team.id), base.generateRedisStatsKey(enums.STAT_MOOOD, response.team.id, true));
        } else {
            console.log(response.message);
        }
    }

    process.exit();
});


