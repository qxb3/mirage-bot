require('dotenv').config()
const { Client, Intents } = require('discord.js')

const path = require('path')
const WokCommands = require('wokcommands')

const mongoose = require('mongoose')

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
 
    mongoose.connect(process.env.MONGODB_URI, (err) => {
        if (err) throw err

        console.log('Connected to mongodb')
    })

    new WokCommands(client, {
        commandDir: path.join(__dirname, './commands'), 
        testServers: [
            '811195710065082378', //Tools server
        ]
    }).setDefaultPrefix('?')
})

client.login(process.env.BOT_TOKEN)
