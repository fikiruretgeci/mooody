'use strict';

exports.clear = function(value) {
    value = value.trim();
    return value.replace(/([^\qwertyuıopğüasdfghjklşizxcvbnmöçQWERTYUIOPĞÜASDFGHJKLŞİZXCVBNMÖÇ0123456789])/g,'');
};

exports.clearDeep = function(value) {
    return (this.clear(value)).toLowerCase();
};

exports.expireDate = function () {
    var end = new Date();
    end.setHours(23,59,59,999);

    return end.getFullYear().toString() + (end.getMonth()+1).toString() + end.getDate().toString();
};

exports.getToday = function () {
    var today = new Date();
    return [today.getDay(),today.getMonth(),today.getFullYear()];
};

exports.randomNumber = function (length) {
  return Math.floor(Math.random() * length);
};

exports.formatDate = function () {
    return new Date().toDateString();
};

/*
* Redis Mooody Data
* Use HSET
* Key: teamid
* Hash: userid:mood
* Value: integer
* EXPIREAT: Date Base TTL
* */
exports.generateRedisStatsKey = function (type,team,lasted) {
    var key = ['stats',type,team.toLowerCase()];
    if(lasted) {
        key.push('lasted');
    }
    return key.join(':');
};

exports.generateRedisHashKeys = function (types, user) {
    var hashKeys = [];
    for(var item in types) {
        if(types.hasOwnProperty(item)) {
            hashKeys.push([item,user].join('_'));
        }
    }
    return hashKeys;
};

exports.generateRedisHashKey = function (hash, user) {
    return [hash,user].join('_');
};

// Collect Stats
exports.collectStats = function (hashKeys, hashValues) {
    var collect = [];
    for (var hash in hashKeys) {
        if(hashKeys.hasOwnProperty(hash)) {
            // Hash: [item]_[user_id]
            var explode = (hashKeys[hash]).split('_');
            var item = explode[0];
            var user = explode[1];
            collect[user] = (!!collect[user] && typeof collect[user] !== "undefined")? collect[user] : {};
            collect[user][item] = (!!hashValues && typeof hashValues[hash] !== "undefined" && !!hashValues[hash]) ? hashValues[hash] : 0;
        }
    }
    return collect;
};

exports.generateStatsText = function (stats) {
    var message = '';
    for (var user in stats) {
        if(stats.hasOwnProperty(user)) {
            message += '*<@' + user + '>*' + "\r";
            for (var item in stats[user]) {
                if(stats[user].hasOwnProperty(item)) {
                    message += '> _' + item + '_' + ':' + stats[user][item] + "\r";
                }
            }
        }
    }

    return message;
};