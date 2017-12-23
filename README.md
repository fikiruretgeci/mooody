Mooody Slack Bot
======

##Why

- It is a Slack Bot User with sending messages to analysis at IBM Watson Natural Language Understanding Platform 

##What

- IBM Watson - Natural Language Understanding Service Example
- Send messages with tags to common channel
- Analysis of messages emotion with IBM Watson

##How

* First you can create new Bot User for your Team -> https://my.slack.com/services/new/bot
* Get the Bot User Token key. -> xoxb-XXXXXXXXX
* Update /process.json -> BOT_TOKEN line
* For Ibm-Watson => https://www.ibm.com/watson/developercloud/natural-language-understanding/api/v1/#introduction
* Update /process.json -> WATSON_USERNAME && WATSON_PASSWORD line
* Run this index.js file -> we use pm2 for run js files. (pm2 start process.json && pm2 save)

![cmd = stats me](/stats-me.png)