require('dotenv').config();
const channel = process.env.GENERAL_CHANNEL || '';
const token = process.env.SLACK_API_TOKEN || '';
const Scheduler = require('./scheduler');
const MessageHandler = require('./message-handlers');
const RtmClient = require('@slack/client').RtmClient;

class Slank {
  start() {
    console.log('starting slank...');
    const client = new RtmClient(token);

    const handlers = new MessageHandler(client);
    handlers.bind();

    const scheduler = new Scheduler(channel);
    scheduler.init();
  }
}

new Slank().start();
