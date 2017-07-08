import { RtmStartResult, ReactionEvent, MessageEvent, RtmClient } from 'slack';
const RTM_EVENTS = require('@slack/client').RTM_EVENTS;
const CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS;

class MessageHandler {
    channelList: Array<any>;

    constructor(private rtmClient: RtmClient) {
        rtmClient.start();
    }

    public bind() {
        console.log('binding message event handlers...');

        this.rtmClient.on(CLIENT_EVENTS.RTM.AUTHENTICATED, (rtmStartData: RtmStartResult) => {
            this.channelList = rtmStartData.channels;
            console.log(`Logged in as ${rtmStartData.self.name} of team ${rtmStartData.team.name}, but not yet connected to a channel`);
        });

        this.rtmClient.on(RTM_EVENTS.MESSAGE, (message: MessageEvent) => {
            console.log(message);

            this.rtmClient.sendMessage(`I got your message <@${message.user}>`, message.channel);
        });

        this.rtmClient.on(RTM_EVENTS.REACTION_ADDED, (reaction: ReactionEvent) => {

            this.rtmClient.sendMessage('Y u gotta be like dat', reaction.item.channel);
            console.log('Reaction added:', reaction);
        });

        this.rtmClient.on(RTM_EVENTS, (reaction: ReactionEvent) => {
            console.log('Reaction removed:', reaction);
        });
    }
}

module.exports = MessageHandler;
