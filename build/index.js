require('dotenv').config();
var channel = process.env.GENERAL_CHANNEL || '';
var token = process.env.SLACK_API_TOKEN || '';
var Scheduler = require('./scheduler');
var MessageHandler = require('./message-handlers');
var RtmClient = require('@slack/client').RtmClient;
var Slank = (function () {
    function Slank() {
    }
    Slank.prototype.start = function () {
        console.log('starting slank...');
        var client = new RtmClient(token);
        var handlers = new MessageHandler(client);
        handlers.bind();
        var scheduler = new Scheduler(channel);
        scheduler.init();
    };
    return Slank;
}());
new Slank().start();
//# sourceMappingURL=index.js.map