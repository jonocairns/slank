var schedule = require('node-schedule');
var WebClient = require('@slack/client').WebClient;
var SlankScheduler = (function () {
    function SlankScheduler(channel) {
        this.channel = channel;
        this.token = process.env.SLACK_API_TOKEN || '';
    }
    SlankScheduler.prototype.init = function () {
        var _this = this;
        var enabled = process.env.ENABLE_SCHEDULER === 'true';
        if (enabled) {
            console.log('initialising scheduler...');
            schedule.scheduleJob('*/10 * * * * *', function () {
                var web = new WebClient(_this.token);
                web.chat.postMessage(_this.channel, 'Its that time already...', function (err, res) {
                    if (err) {
                        console.log('Error:', err);
                    }
                    else {
                        console.log('scheduled job ran successfully.');
                    }
                });
            });
        }
        else {
            console.log('scheduler not enabled (if this is wrong check your .env file)');
        }
    };
    return SlankScheduler;
}());
module.exports = SlankScheduler;
//# sourceMappingURL=scheduler.js.map