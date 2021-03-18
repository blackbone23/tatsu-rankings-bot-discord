require('dotenv').config();
const Discord = require('discord.js');
const bot = new Discord.Client();
const TOKEN = process.env.TOKEN;
const TETSUTOKEN = process.env.TETSUTOKEN
console.log(TOKEN)
console.log(TETSUTOKEN)
const { curly } = require('node-libcurl');

bot.login(TOKEN);

bot.on('ready', () => {
  console.info(`Logged in as ${bot.user.tag}!`);
});

bot.on('message', async msg => {
  if (msg.content.startsWith('!guild')) {
    const guild = await curly.get('https://api.tatsu.gg/v1/guilds/173184118492889089/rankings/all', {
      httpHeader: [
        'Content-Type: application/json',
        'Accept: application/json',
        `Authorization: ${TETSUTOKEN}`
      ],
    })
    console.log(guild.headers)
    if (msg.content.split(' ')[1]) {
      switch (msg.content.split(' ')[1]) {
        case 'rankings':
          if (msg.content.split(' ')[2]) {
            if (!isNaN(parseInt(msg.content.split(' ')[2], 10)) && parseInt(msg.content.split(' ')[2]) <= 10) {
              let text = `> **See guild leaderboardby top ${msg.content.split(' ')[2]}**\n\n`
              text += '>>> '
              let user = null
              for (let i = 0; i < parseInt(msg.content.split(' ')[2], 10); i++) {
                user = await curly.get(`https://api.tatsu.gg/v1/users/${guild.data.rankings[i].user_id}/profile`, {
                  httpHeader: [
                    'Content-Type: application/json',
                    'Accept: application/json',
                    `Authorization: ${TETSUTOKEN}`
                  ],
                })
                // console.log(user.data)
                text += `**#${i + 1}**  *${user.data.username} - ${user.data.title}* \nID : ${user.data.id}\nTitle : ${user.data.title}\nExp : ${user.data.xp}\nReputation : ${user.data.reputation}\n\n`
              }
              return msg.channel.send(text);
            }
          }
          msg.channel.send(`you must set max to 10 people on leaderboards`)
          break;
        default:
          console.log('**your command is unknown!**')
      }
    }
  }

});
