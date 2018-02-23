import { RtmStartResult, ReactionEvent, MessageEvent, RtmClient } from 'slack';
const RTM_EVENTS = require('@slack/client').RTM_EVENTS;
const CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS;
const fs = require('fs');

class MessageHandler {
    channelList: Array<any>;

    constructor(private rtmClient: RtmClient) {
        rtmClient.start();
    }

    public bind() {
        console.log('binding message event handlers...');

        let data = this.load();

        this.rtmClient.on(CLIENT_EVENTS.RTM.AUTHENTICATED, (rtmStartData: RtmStartResult) => {
            this.channelList = rtmStartData.channels;
            console.log(`Logged in as ${rtmStartData.self.name} of team ${rtmStartData.team.name}, but not yet connected to a channel`);
        });

        const userNameRegex = new RegExp('^\<\@[A-Za-z0-9]+\>$');

        this.rtmClient.on(RTM_EVENTS.MESSAGE, (message: MessageEvent) => {
            console.log(message);
            data = this.load();

            try {
                if (message && message.text && message.text.startsWith('.robin')) {

                    // make this better...
                    const blah = message.text.split(' ');
                    blah.shift();
                    blah.shift();
                    const test = blah.join(' ');
                    console.log(test);

                    if (message.text.startsWith('.robin add')) {
                        test.split(' ').forEach(element => {
                            if (!userNameRegex.test(element)) {
                                return;
                            }

                            if (!data.users.includes(element)) {
                                console.log(`user ${element} does not exist... adding...`);
                                this.rtmClient.sendMessage(`adding ${element}...`, message.channel);
                                data.users.push(element);
                                this.save(data);
                            } else {
                                console.log(`user ${element} already exists...`);
                            }
                        });
                    }

                    if (message.text.startsWith('.robin assign')) {
                        const user = data.users[Math.floor(Math.random() * data.users.length)];

                        this.rtmClient.sendMessage(`${user} has been randomly assigned to ${test}`, message.channel);
                    }

                    if (message.text.startsWith('.robin list')) {
                        console.log(data.users);
                        if (data.users.length > 0) {
                            this.rtmClient.sendMessage(`here are the users I have currently... ${data.users.join(', ')}`, message.channel);
                        } else {
                            this.rtmClient.sendMessage(`there are no users added yet. type \`.robin add @username @anotheruser\` to add some`, message.channel);
                        }
                    }

                    if (message.text.startsWith('.robin remove')) {
                        test.split(' ').forEach(element => {
                            if (!userNameRegex.test(element)) {
                                return;
                            }

                            if (!data.users.includes(element)) {
                                this.rtmClient.sendMessage(`that user doesn't exist...`, message.channel);
                            } else {
                                const index = data.users.indexOf(element);    // <-- Not supported in <IE9
                            if (index !== -1) {
                                data.users.splice(index, 1);
                            }
                            this.rtmClient.sendMessage(`removing ${element}...`, message.channel);
                            this.save(data);
                            }
                        });
                    }
                }
            } catch (err) {
                console.log(err);
                this.rtmClient.sendMessage(`something bad happened...`, message.channel);
            }
        });
    }

    private load(): any {
        const rawdata = fs.readFileSync('./src/data.json');

        return JSON.parse(rawdata);
    }

    private save(data: any): void {
        const dataString = JSON.stringify(data);
        fs.writeFileSync('./src/data.json', dataString);
    }
}

module.exports = MessageHandler;
