import { MessageEvent, ReactionEvent } from 'slack';

const blah = require('dotenv').config();
const RtmClient = require('@slack/client').RtmClient;
const CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS;
const RTM_EVENTS = require('@slack/client').RTM_EVENTS;
const MemoryDataStore = require('@slack/client').MemoryDataStore;

const token = process.env.SLACK_API_TOKEN || '';
const rtm = new RtmClient(token);
rtm.start();

rtm.on(RTM_EVENTS.MESSAGE, (message: MessageEvent) => {
  console.log(message);

  rtm.sendMessage('I got your message', message.channel);
});

rtm.on(RTM_EVENTS.REACTION_ADDED, (reaction: ReactionEvent) => {
  console.log('Reaction added:', reaction);
});

rtm.on(RTM_EVENTS.REACTION_REMOVED, (reaction: ReactionEvent) => {
  console.log('Reaction removed:', reaction);
});

