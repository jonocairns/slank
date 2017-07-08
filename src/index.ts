import { MessageEvent, ReactionEvent, RtmClient } from 'slack';
require('dotenv').config();
const CLIENT = require('@slack/client').RtmClient;
const rtmEvents = require('@slack/client').RTM_EVENTS;
const CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS;
const token = process.env.SLACK_API_TOKEN || '';
// tslint:disable-next-line:variable-name
const Scheduler = require('./scheduler');
const rtm: RtmClient = new CLIENT(token);
rtm.start();

let channel = 'C65P550US';

const scheduler = new Scheduler(channel);
scheduler.init();

rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, (rtmStartData: any) => {
  for (const c of rtmStartData.channels) {
    if (c.is_member && c.name === 'general') {
      channel = c.id;
    }
  }
  console.log(`Logged in as ${rtmStartData.self.name} of team ${rtmStartData.team.name}, but not yet connected to a channel`);
});

rtm.on(rtmEvents.MESSAGE, (message: MessageEvent) => {
  console.log(message);

  rtm.sendMessage('I got your message', message.channel);
});

rtm.on(rtmEvents.REACTION_ADDED, (reaction: ReactionEvent) => {

  rtm.sendMessage('Y u gotta be like dat', reaction.item.channel);
  console.log('Reaction added:', reaction);
});

rtm.on(rtmEvents.REACTION_REMOVED, (reaction: ReactionEvent) => {
  console.log('Reaction removed:', reaction);
});

