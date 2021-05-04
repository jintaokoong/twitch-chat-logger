import { ChatClient } from 'twitch-chat-client'
import { promises as fs } from 'fs';

const chatClient = ChatClient.anonymous({ channels: [''] });

chatClient.onConnect(() => {
    console.log('connected');
})

const messageListener = chatClient.onMessage((_channel, user, message, msg) => {
    // const ut = msg.userInfo.userType.length > 0 ? msg.userInfo.userType.toUpperCase() : 'U';
    const dp = msg.userInfo.displayName;
    const millis = new Date();
    const now = millis.toISOString();
    const log = `${now} ${dp}: ${message}`;
    fs.appendFile(`./${millis.getUTCFullYear()}${millis.getUTCMonth()}${millis.getUTCDay()}.log`, `${log}\n`).then(() => {
        console.log(log);
    });
});

const disconnectListener = chatClient.onDisconnect(((manually, reason) => {
    console.log(manually, reason);
}))

process.on('SIGNINT', () => {
    chatClient.removeListener(messageListener);
    chatClient.removeListener(disconnectListener);
});

chatClient.connect().then(() => {

});

