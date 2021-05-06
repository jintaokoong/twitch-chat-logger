import { ChatClient } from 'twitch-chat-client'
import { promises as fs } from 'fs';
import { getLogName } from './utils/log-utils'
import { StringBuilder } from './utils/string-builder';

interface Config {
  channels: string[];
}

const main = async () => {
  const b = await fs.readFile('./app-config.json');
  const config: Config = JSON.parse(b.toString());

  const chatClient = ChatClient.anonymous({ channels: config.channels })

  chatClient.onConnect(() => {
    console.log('connected')
  })

  const messageListener = chatClient.onMessage((channel, user, message, msg) => {
    // const ut = msg.userInfo.userType.length > 0 ? msg.userInfo.userType.toUpperCase() : 'U';
    const sb = new StringBuilder(' ');
    const { userType, userName } = msg.userInfo;
    const dp = msg.userInfo.displayName;
    const name = dp === userName ? dp : `${dp} (${userName})`;

    const date = new Date()
    const now = date.toISOString()

    sb.append(now);
    if (userType && userType.length > 0) {
      sb.append(`[${userType.toUpperCase()}]`)
    }
    sb.append(name);
    sb.append(message);
    const log = sb.concatenate();

    fs.appendFile(
      getLogName(channel, date),
      `${log}\n`).then(() => {
      console.log(`${channel} ${log}`);
    })
  })

  chatClient.onBan((c, u) => {
    const sb = new StringBuilder(' ');

    const date = new Date();
    const now = date.toISOString();
    sb.append(now);
    sb.append(`${u} is banned.`);
    const log = sb.concatenate();

    fs.appendFile(
      getLogName(c, date), `${log}\n`).then(() => {
      console.log(`${c} ${log}`);
    })
  })

  const disconnectListener = chatClient.onDisconnect(((manually, reason) => {
    console.log(manually, reason)
  }))

  process.on('SIGNINT', () => {
    chatClient.removeListener(messageListener)
    chatClient.removeListener(disconnectListener)
  });

  await chatClient.connect()
}

(async () => {
  await main();
})()
