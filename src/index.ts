require('dotenv').config();
var WebClient = require('@slack/client').WebClient;

var token = process.env.SLACK_API_TOKEN || '';
console.log(token);

var web = new WebClient(token);
web.chat.postMessage('general', 'Hello there', (err: Error, res: any) => {
    if (err) {
        console.log('Error:', err);
    } else {
        console.log('Message sent: ', res);
    }
});