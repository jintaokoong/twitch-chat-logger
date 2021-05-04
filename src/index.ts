interface Config {
  channels: string[];
}

const main = async () => {
  const { promises: fs }  = require('fs');
  const { ChatClient } = require('twitch-chat-client');

  const b = await fs.readFile('./app-config.json');
  const config: Config = JSON.parse(b.toString());

  const chatClient = ChatClient.anonymous({ channels: config.channels })

  chatClient.onConnect(() => {
    console.log('connected')
  })

  const messageListener = chatClient.onMessage((channel, user, message, msg) => {
    // const ut = msg.userInfo.userType.length > 0 ? msg.userInfo.userType.toUpperCase() : 'U';
    const { userType, userName } = msg.userInfo
    const dp = msg.userInfo.displayName
    let name = ''
    if (dp === name) {
      name = dp;
    } else {
      name = `${dp} (${userName})`;
    }

    const millis = new Date()
    const now = millis.toISOString()

    const log = `${now} ${name}: ${message}`

    fs.appendFile(
      `./${channel.replace('#', '')}_${millis.getUTCFullYear()}${millis.getUTCMonth()}${millis.getUTCDay()}.log`,
      `${log}\n`).then(() => {
      console.log(log)
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
