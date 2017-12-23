'use strict';

var base = require('./base');
var enums = require('./enum');
var config = require('../config/index');
var global = require('./global');
var commands = require('./command');

exports.collectGlobalData = function (rtmStartData) {
    var globalData = global.globalData;

    // INFO: Team
    globalData.team = {
        id: rtmStartData.team.id,
        name: rtmStartData.team.name,
        domain: rtmStartData.team.domain
    };
    // INFO: Channels
    var channelData;
    for (var i in rtmStartData.channels) {
        channelData = {
            id: rtmStartData.channels[i].id,
            name: rtmStartData.channels[i].name,
            name_normalized: rtmStartData.channels[i].name_normalized,
            is_channel: rtmStartData.channels[i].is_channel,
            is_member: rtmStartData.channels[i].is_member,
            is_private: rtmStartData.channels[i].is_private,
            is_general: rtmStartData.channels[i].is_general,
            is_archived: rtmStartData.channels[i].is_archived
        };

        globalData.channels[rtmStartData.channels[i].id] = channelData;

        // Check Mooody Channel
        if (
            !!config.MOOODY_CHANNEL
            && rtmStartData.channels[i].name === config.MOOODY_CHANNEL
        ){
            globalData.mooodyChannels[rtmStartData.channels[i].id] = channelData;
        }
    }
    // INFO: Users
    for (var u in rtmStartData.users) {
        // Collect only real users and exclude slack bot
        var userData;
        if(!rtmStartData.users[u].is_bot && rtmStartData.users[u].id !== 'USLACKBOT') {
            userData = {
                id: rtmStartData.users[u].id,
                team_id: rtmStartData.users[u].team_id,
                name: rtmStartData.users[u].name,
                real_name: rtmStartData.users[u].real_name,
                color: rtmStartData.users[u].color,
            };

            globalData.users[rtmStartData.users[u].id] = userData;
        }
    }

    return globalData;
};

// Slack Request
exports.parseAll = function(argv) {
    // Slice the text message
    argv.text = (argv.text).substr(0, config.MSG_MAX);
    var defaultArgv = {
        cmd: null,
        subcmd: null,
        moood: null,
        greet: null,
        text: null,
        msg: argv.text,
        channel: null,
        user: null,
        team: null,
        source_team: null
    };

    switch (argv.type)
    {
        case 'message':
            // Check Greet Message
            var regexp = /([#](övben|tebri|gree))\w+/g;
            defaultArgv.greet = argv.text.match(regexp);
            if(defaultArgv.greet === null) {
                var explode = argv.text.split(' ');
                defaultArgv.cmd = (explode.length > 0) ? explode[0] : explode;
                defaultArgv.cmd = base.clear(defaultArgv.cmd);
                defaultArgv.cmd = (defaultArgv.cmd).toLowerCase(); // Lowercase
                if(enums.cmdList.indexOf(defaultArgv.cmd) === -1) {
                    defaultArgv.cmd = null;
                } else {
                    var sliceCount = defaultArgv.cmd.length + 1;
                    var subcmd = (typeof explode[1] !== 'undefined')? (explode[1]).toLowerCase() : '';
                    if(explode.length > 1 && enums.cmdSubList.indexOf(subcmd) !== -1) {
                        defaultArgv.subcmd = base.clear(subcmd);
                        defaultArgv.subcmd = (defaultArgv.subcmd).toLowerCase(); // Lowercase
                        sliceCount += defaultArgv.subcmd.length+1;
                    }
                    defaultArgv.text = argv.text.slice(sliceCount);
                }
            }
            break;
    }

    defaultArgv.channel = argv.channel;
    defaultArgv.user = argv.user;
    defaultArgv.team = argv.team;
    defaultArgv.source_team = argv.source_team;

    return defaultArgv;
};

exports.start = function(argv, globalData) {
    var self = this;
    global.set(globalData);
    argv = self.parseAll(argv);
    return new Promise(function (resolve, reject) {

        // Default Message
        var response = {
            message: null,
            channel: argv.channel
        };

        if(!!global.getOneUser(argv.user)) {
            // Real User Message
            switch (argv.cmd)
            {
                case 'stats':
                    if(!!argv.subcmd) {
                        return commands.stats(argv).then(function (result) {
                            response.message = result;
                            return resolve(response);
                        }).catch(function(err) {
                            response.message = err;
                            return reject(response);
                        });
                    }
                    break;
                case 'help':
                    response.message = '*HELP COMMANDS*' + "\r\r";
                    for (var h in enums.cmdDetail){
                        if(typeof enums.cmdDetail[h] === 'object') {
                            for (var mm in enums.cmdDetail[h]){
                                response.message += enums.cmdDetail[h][mm];
                            }
                        } else {
                            response.message += enums.cmdDetail[h];
                        }
                        response.message += "\r";
                    }
                    break;
                case 'hey':
                    response.message = 'Hoop. I\'m still here.';
                    break;
                case 'crosscheck':
                    response.message = '*' + config.NAME + ' Project* - Produced by '
                        + config.AUTHORS.join(' and ')
                        + "\n" + ' v' + config.VERSION
                        + ' (' + config.UPDATE + ')'
                        + "\r\r";
                    break;
                default:
                    // This is DM
                    return commands.moood(argv, global.getOneUser(argv.user), global.getMooodyChannels()).then(function (result) {
                        response.message = result;
                        return resolve(response);
                    }).catch(function(err) {
                        response.message = err;
                        return reject(response);
                    });
            }
        }
        return resolve(response);
    });
};