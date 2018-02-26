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
        this.load();
        this.rtmClient.on(CLIENT_EVENTS.RTM.AUTHENTICATED, function (rtmStartData) {
            _this.channelList = rtmStartData.channels;
            console.log("Logged in as " + rtmStartData.self.name + " of team " + rtmStartData.team.name + ", but not yet connected to a channel");
        });
        var userNameRegex = new RegExp('^\<\@[A-Za-z0-9]+\>$');
        this.rtmClient.on(RTM_EVENTS.MESSAGE, function (message) {
            console.log(message);
            _this.load();
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
                                _this.data.users.push(element);
                                _this.save();
                            }
                            else {
                                console.log("user " + element + " already exists...");
                            }
                        });
                    }
                    if (message.text.startsWith('.robin assign')) {
                        console.log(message.user);
                        var assignee = _this.getNextUser(message.user);
                        _this.rtmClient.sendMessage(assignee + " has been randomly assigned to " + test, message.channel);
                    }
                    if (message.text.startsWith('.robin list')) {
                        console.log(data.users);
                        if (_this.data.users.length > 0) {
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
                            if (!_this.data.users.includes(element)) {
                                _this.rtmClient.sendMessage("that user doesn't exist...", message.channel);
                            }
                            else {
                                var index = _this.data.users.indexOf(element);
                                if (index !== -1) {
                                    _this.data.users.splice(index, 1);
                                }
                                _this.rtmClient.sendMessage("removing " + element + "...", message.channel);
                                _this.save();
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
    MessageHandler.prototype.getNextUser = function (thisUser) {
        if (this.userQueue == null || !this.userQueue.some(function (user) { return user !== thisUser; })) {
            this.userQueue = this.data.users.slice();
            this.userQueue.sort(function () { return Math.round(Math.random()) * 2 - 1; });
        }
        var idx = this.userQueue.findIndex(function (user) { return user !== thisUser; });
        var user = this.userQueue.splice(idx, 1)[0];
        return user;
    };
    MessageHandler.prototype.load = function () {
        var rawdata = fs.readFileSync('./src/data.json');
        this.data = JSON.parse(rawdata);
    };
    MessageHandler.prototype.save = function () {
        var dataString = JSON.stringify(this.data);
        fs.writeFileSync('./src/data.json', dataString);
    };
    return MessageHandler;
}());
module.exports = MessageHandler;
//# sourceMappingURL=message-handlers.js.map