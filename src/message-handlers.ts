import { RtmStartResult, ReactionEvent, MessageEvent, RtmClient } from 'slack';
const RTM_EVENTS = require('@slack/client').RTM_EVENTS;
const CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS;
const fs = require('fs');

class MessageHandler {
    channelList: Array<any>;
    data: any;
    userQueue: Array<string>;

    constructor(private rtmClient: RtmClient) {
        rtmClient.start();
    }

    public bind() {
        console.log('binding message event handlers...');

        this.load();

        this.rtmClient.on(CLIENT_EVENTS.RTM.AUTHENTICATED, (rtmStartData: RtmStartResult) => {
            this.channelList = rtmStartData.channels;
            console.log(`Logged in as ${rtmStartData.self.name} of team ${rtmStartData.team.name}, but not yet connected to a channel`);
        });

        const userNameRegex = new RegExp('^\<\@[A-Za-z0-9]+\>$');

        this.rtmClient.on(RTM_EVENTS.MESSAGE, (message: MessageEvent) => {
            console.log(message);
            this.load();

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
                                this.data.users.push(element);
                                this.save();
                            } else {
                                console.log(`user ${element} already exists...`);
                            }
                        });
                    }

                    if (message.text.startsWith('.robin assign')) {

                        console.log(message.user);

                        const assignee = this.getNextUser(message.user);

                        this.rtmClient.sendMessage(`${assignee} has been randomly assigned to ${test}`, message.channel);
                    }

                    if (message.text.startsWith('.robin list')) {
                        console.log(data.users);
                        if (this.data.users.length > 0) {
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

                            if (!this.data.users.includes(element)) {
                                this.rtmClient.sendMessage(`that user doesn't exist...`, message.channel);
                            } else {
                                const index = this.data.users.indexOf(element);    // <-- Not supported in <IE9
                            if (index !== -1) {
                                this.data.users.splice(index, 1);
                            }
                            this.rtmClient.sendMessage(`removing ${element}...`, message.channel);
                            this.save();
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

    private getNextUser(thisUser: string): string {
        if (this.userQueue == null || !this.userQueue.some(user => user !== thisUser)) {
            const unrandomizedUsers = this.data.users.slice();
            this.userQueue = [];
            while (unrandomizedUsers.length > 0) {
                const randomIdx = Math.floor(Math.random() * unrandomizedUsers.length);
                const [randomUser] = unrandomizedUsers.splice(randomIdx, 1);
                this.userQueue.push(randomUser);
            }
        }

        const idx = this.userQueue.findIndex(user => user !== thisUser);
        const [selectedUser] = this.userQueue.splice(idx, 1);

        return selectedUser;
    }


    private load(): void {
        const rawdata = fs.readFileSync('./src/data.json');

        this.data = JSON.parse(rawdata);
        this.userQueue = null;
    }

    private save(): void {
        const dataString = JSON.stringify(this.data);
        fs.writeFileSync('./src/data.json', dataString);
    }
}

module.exports = MessageHandler;
