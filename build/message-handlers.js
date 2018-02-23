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
            data = _this.load();
            try {
                if (message && message.text && message.text.startsWith('.robin')) {
                    var blah = message.text.split(' ');
                    blah.shift();
                    blah.shift();
                    var test = blah.join(' ');
                    console.log(test);
                    if (message.text.startsWith('.robin add')) {
                        test.split(' ').forEach(function (element) {
                            if (!userNameRegex.test(element)) {
                                return;
                            }
                            if (!data.users.includes(element)) {
                                console.log("user " + element + " does not exist... adding...");
                                _this.rtmClient.sendMessage("adding " + element + "...", message.channel);
                                data.users.push(element);
                                _this.save(data);
                            }
                            else {
                                console.log("user " + element + " already exists...");
                            }
                        });
                    }
                    if (message.text.startsWith('.robin assign')) {
                        console.log(message.user);
                        var i = data.users.indexOf("<@" + message.user + ">");
                        var copy = data.users.slice();
                        console.dir(copy);
                        if (i !== -1) {
                            copy.splice(i, 1);
                        }
                        console.dir(copy);
                        var user = copy[Math.floor(Math.random() * copy.length)];
                        _this.rtmClient.sendMessage(user + " has been randomly assigned to " + test, message.channel);
                    }
                    if (message.text.startsWith('.robin list')) {
                        console.log(data.users);
                        if (data.users.length > 0) {
                            _this.rtmClient.sendMessage("here are the users I have currently... " + data.users.join(', '), message.channel);
                        }
                        else {
                            _this.rtmClient.sendMessage("there are no users added yet. type `.robin add @username @anotheruser` to add some", message.channel);
                        }
                    }
                    if (message.text.startsWith('.robin remove')) {
                        test.split(' ').forEach(function (element) {
                            if (!userNameRegex.test(element)) {
                                return;
                            }
                            if (!data.users.includes(element)) {
                                _this.rtmClient.sendMessage("that user doesn't exist...", message.channel);
                            }
                            else {
                                var index = data.users.indexOf(element);
                                if (index !== -1) {
                                    data.users.splice(index, 1);
                                }
                                _this.rtmClient.sendMessage("removing " + element + "...", message.channel);
                                _this.save(data);
                            }
                        });
                    }
                }
            }
            catch (err) {
                console.log(err);
                _this.rtmClient.sendMessage("something bad happened...", message.channel);
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