'use strict';

/*
* WATSON_MSG_MIN: min message length for IBM WATSON
* WATSON_MSG_MAX: max message length for IBM WATSON
*
* FROM PROCESS ENV
* ===========
* WATSON_USERNAME: IBM Watson username
* WATSON_PASSWORD: IBM Watson password
* WATSON_VERSION: IBM Watson, The release date of the version of the API you want to use. Specify dates in YYYY-MM-DD format. The current version is 2017-02-27.
* MOOODY_CHANNEL: The name of the channel to which all messages were shared
* BOT_TOKEN: xoxo-XXXXXXXXXXXXXX
* */
var config = {
    NAME: 'Mooody',
    PREFIX: 'mooody:',
    AUTHORS: ['HTO','Uretgec'],
    VERSION: '0.1',
    UPDATE: 'Saturday, November 15, 2017',
    WHOAMI: 'Hi, I\'m Mooody.',
    MSG_MAX: 999,
    WATSON_URL: 'https://gateway.watsonplatform.net/natural-language-understanding/api/v1/analyze',
    WATSON_MSG_MIN: 50,
    WATSON_MSG_MAX: 999,
    WATSON_USERNAME: process.env.WATSON_USERNAME,
    WATSON_PASSWORD: process.env.WATSON_PASSWORD,
    WATSON_VERSION: process.env.WATSON_VERSION,
    MOOODY_CHANNEL: process.env.MOOODY_CHANNEL,
    BOT_TOKEN: process.env.BOT_TOKEN,
    SLACK_API_URL: 'https://slack.com/api/'
};

module.exports = config;