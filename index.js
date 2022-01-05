require('module-alias/register')
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
    client.user.setActivity({
        name: 'Mirage Realms',
        type: 'PLAYING'
    })

    new WokCommands(client, {
        commandDir: path.join(__dirname, './commands'), 
        featuresDir: path.join(__dirname, './features'),
        mongoUri: process.env.MONGO_URI,
        testServers: ['811195710065082378', '917358098241445909'],
        botOwners: ['591150858830479381'], 
        disabledDefaultCommands: [
            'channelonly', 'command', 'language',
            /*'prefix', */'requiredrole',
        ]
    })
    .setDefaultPrefix('?')
    .setCategorySettings([])
})

client.login(process.env.TOKEN)
