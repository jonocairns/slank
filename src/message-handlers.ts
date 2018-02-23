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


            if (message.text.startsWith('.robin')) {
                data = this.load();

                // make this better...
                const blah = message.text.split(' ');
                blah.shift();
                blah.shift();
                const test = blah.join(' ');
                console.log(test);

                if (message.text.startsWith('.robin add')) {
                    if (!userNameRegex.test(test)) {
                        this.rtmClient.sendMessage(`wrong command... use \`.robin add @username\``, message.channel);

                        return;
                    }

                    if (!data.users.includes(test)) {
                        console.log(`user ${test} does not exist... adding...`);
                        data.users.push(test);
                        this.save(data);
                    } else {
                        console.log(`user ${test} already exists...`);
                    }
                }

                if (message.text.startsWith('.robin assign')) {
                    const user = data.users[Math.floor(Math.random() * data.users.length)];

                    this.rtmClient.sendMessage(`${user} has been randomly assigned to ${test}`, message.channel);
                }

                if (message.text.startsWith('.robin list')) {
                    this.rtmClient.sendMessage(`here are the users I have currently... ${data.users.join(', ')}`, message.channel);
                }

                if (message.text.startsWith('.robin remove')) {
                    if (!userNameRegex.test(test)) {
                        this.rtmClient.sendMessage(`wrong command... use \`.robin remove @username\``, message.channel);

                        return;
                    }

                    if (!data.users.includes(test)) {
                        this.rtmClient.sendMessage(`that user doesn't exist...`, message.channel);
                    } else {
                        const index = data.users.indexOf(test);    // <-- Not supported in <IE9
                        if (index !== -1) {
                            data.users.splice(index, 1);
                        }
                        this.rtmClient.sendMessage(`removing ${test}...`, message.channel);
                        this.save(data);
                    }
                }
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
