const schedule = require('node-schedule');
const WebClient = require('@slack/client').WebClient;

class SlankScheduler {
    private token: string;
    private channel: string;

    constructor(channel: string) {
        this.channel = channel;
        this.token = process.env.SLACK_API_TOKEN || '';
    }

    public init() {

        const enabled = process.env.ENABLE_SCHEDULER === 'true';

        if (enabled) {
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
        } else {
            console.log('scheduler not enabled (if this is wrong check your .env file)');
        }

    }
}

module.exports = SlankScheduler;
