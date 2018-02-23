var RTM_EVENTS = require('@slack/client').RTM_EVENTS;
var CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS;
var fs = require('fs');
var MessageHandler = (function () {
    function MessageHandler(rtmClient) {
        this.rtmClient = rtmClient;
        rtmClient.start();
    }
    MessageHandler.prototype.bind = function () {
        var _this = this;
        console.log('binding message event handlers...');
        var data = this.load();
        this.rtmClient.on(CLIENT_EVENTS.RTM.AUTHENTICATED, function (rtmStartData) {
            _this.channelList = rtmStartData.channels;
            console.log("Logged in as " + rtmStartData.self.name + " of team " + rtmStartData.team.name + ", but not yet connected to a channel");
        });
        var userNameRegex = new RegExp('^\<\@[A-Za-z0-9]+\>$');
        this.rtmClient.on(RTM_EVENTS.MESSAGE, function (message) {
            console.log(message);
            if (message.text.startsWith('.robin')) {
                data = _this.load();
                var blah = message.text.split(' ');
                blah.shift();
                blah.shift();
                var test = blah.join(' ');
                console.log(test);
                if (message.text.startsWith('.robin add')) {
                    if (!userNameRegex.test(test)) {
                        _this.rtmClient.sendMessage("wrong command... use `.robin add @username`", message.channel);
                        return;
                    }
                    if (!data.users.includes(test)) {
                        console.log("user " + test + " does not exist... adding...");
                        data.users.push(test);
                        _this.save(data);
                    }
                    else {
                        console.log("user " + test + " already exists...");
                    }
                }
                if (message.text.startsWith('.robin assign')) {
                    var user = data.users[Math.floor(Math.random() * data.users.length)];
                    _this.rtmClient.sendMessage(user + " has been randomly assigned to " + test, message.channel);
                }
                if (message.text.startsWith('.robin list')) {
                    _this.rtmClient.sendMessage("here are the users I have currently... " + data.users.join(', '), message.channel);
                }
                if (message.text.startsWith('.robin remove')) {
                    if (!userNameRegex.test(test)) {
                        _this.rtmClient.sendMessage("wrong command... use `.robin remove @username`", message.channel);
                        return;
                    }
                    if (!data.users.includes(test)) {
                        _this.rtmClient.sendMessage("that user doesn't exist...", message.channel);
                    }
                    else {
                        var index = data.users.indexOf(test);
                        if (index !== -1) {
                            data.users.splice(index, 1);
                        }
                        _this.rtmClient.sendMessage("removing " + test + "...", message.channel);
                        _this.save(data);
                    }
                }
            }
        });
    };
    MessageHandler.prototype.load = function () {
        var rawdata = fs.readFileSync('./src/data.json');
        return JSON.parse(rawdata);
    };
    MessageHandler.prototype.save = function (data) {
        var dataString = JSON.stringify(data);
        fs.writeFileSync('./src/data.json', dataString);
    };
    return MessageHandler;
}());
module.exports = MessageHandler;
//# sourceMappingURL=message-handlers.js.map