require('module-alias/register')
require('dotenv').config()

const { Client, Intents } = require('discord.js')
const WokCommands = require('wokcommands')

const { setBotActivity } = require('@utils/utils')
const path = require('path')

const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS
    ]
})

client.once('ready', () => {
    setInterval(() => {
        setBotActivity(client)
    }, 1000 * 60)

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
