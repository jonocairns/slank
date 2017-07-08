const schedule = require('node-schedule');
const WebClient = require('@slack/client').WebClient;

class Scheduler {
    private token: string;
    private channel: string;

    constructor(channel: string) {
        this.channel = channel;
        this.token = process.env.SLACK_API_TOKEN || '';
    }

    public init() {
        console.log('initialising scheduler...');

        schedule.scheduleJob('*/10 * * * * *', () => {
            const web = new WebClient(this.token);
            web.chat.postMessage(this.channel, 'Its that time already...', (err: any, res: any) => {
                if (err) {
                    console.log('Error:', err);
                } else {
                    console.log('scheduled job ran successfully.');
                }
            });
        });
    }
}

module.exports = Scheduler;
