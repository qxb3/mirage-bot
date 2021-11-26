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

const setBotActivity = (client) => {
    client.user.setActivity({
        type: 'WATCHING',
        name: `On ${client.guilds.cache.size} Servers!!`
    })
}

client.on('ready', () => {
    setBotActivity(client)
 
    new WokCommands(client, {
        commandDir: path.join(__dirname, './commands'), 
        testServers: [
            '811195710065082378'
        ]
    })
    .setDefaultPrefix('?')
    .setBotOwner('591150858830479381')
})

client.login(process.env.BOT_TOKEN)
