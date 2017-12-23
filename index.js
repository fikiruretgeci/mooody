'use strict';

var config = require('./config/index');
var mooody = require('./lib/mooody');
var SlackClient = require('@slack/client');
var RtmClient = SlackClient.RtmClient;
var CLIENT_EVENTS = SlackClient.CLIENT_EVENTS;
var RTM_EVENTS = SlackClient.RTM_EVENTS;
var globalData = null;
var rtm = new RtmClient(config.BOT_TOKEN);

// RTM.AUTHENTICATED
rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, function(rtmStartData) {
    globalData = mooody.collectGlobalData(rtmStartData);
});

// SEND MESSAGES
rtm.on(CLIENT_EVENTS.RTM.RTM_CONNECTION_OPENED, function () {
    console.log('****'+config.NAME+' Listening****');
});

// RECEIVED MESSAGE
rtm.on(RTM_EVENTS.MESSAGE, function (argv) {
    // Mooody Main App
    mooody
        .start(argv, globalData)
        .then(function(response) {
            if(!!response.message && !!response.channel) {
                rtm.sendTyping(argv.channel);
                setTimeout(function(){
                    rtm.sendMessage(response.message, response.channel);
                }, 1000);
            }
        }).catch(function (err) {
            console.log('ERROR:', err);
            // setTimeout(function(){
            //     rtm.sendMessage(err.message, argv.channel);
            // }, 1000);
        }
    );
});

rtm.start();