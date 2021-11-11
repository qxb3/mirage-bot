require('dotenv').config()
const { Client, Intents } = require('discord.js')

const path = require('path')
const WokCommands = require('wokcommands')

const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS
    ]
})

client.on('ready', () => {
    console.log("The bot is running")

    client.user.setActivity({
        type: 'WATCHING',
        name: `${client.guilds.cache.size} Servers!!`
    })
    
    new WokCommands(client, {
        commandDir: path.join(__dirname, './commands'),
        testServers: [
            '811195710065082378', //Tools server
            '586118235280244736' //Filipino mirage server
        ]
    }).setDefaultPrefix('?')
})

client.login(process.env.BOT_TOKEN)
