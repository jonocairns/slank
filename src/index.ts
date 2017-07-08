import { MessageEvent, ReactionEvent, RtmClient } from 'slack';
require('dotenv').config();
const CLIENT = require('@slack/client').RtmClient;
const rtmEvents = require('@slack/client').RTM_EVENTS;
const CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS;
const schedule = require('node-schedule');
const WebClient = require('@slack/client').WebClient;

const token = process.env.SLACK_API_TOKEN || '';
const rtm: RtmClient = new CLIENT(token);
rtm.start();

let channel = '';

rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, (rtmStartData: any) => {
  for (const c of rtmStartData.channels) {
    console.log(c);
    if (c.is_member && c.name === 'general') {
      console.log(`channel ID: ${c.id}`);
      channel = c.id;
    }
  }
  console.log(`Logged in as ${rtmStartData.self.name} of team ${rtmStartData.team.name}, but not yet connected to a channel`);
});

schedule.scheduleJob('*/10 * * * * *', () => {
  const web = new WebClient(token);
  web.chat.postMessage(channel, 'Its that time already...', (err: any, res: any) => {
    if (err) {
      console.log('Error:', err);
    } else {
      // console.log('Message sent: ', res);
    }
  });
});

rtm.on(rtmEvents.MESSAGE, (message: MessageEvent) => {
  console.log(message);

  rtm.sendMessage('I got your message', message.channel);
});

rtm.on(rtmEvents.REACTION_ADDED, (reaction: ReactionEvent) => {
  console.log('Reaction added:', reaction);
});

rtm.on(rtmEvents.REACTION_REMOVED, (reaction: ReactionEvent) => {
  console.log('Reaction removed:', reaction);
});

