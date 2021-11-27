require('dotenv').config()
const { Client, Intents, WebhookClient, MessageEmbed } = require('discord.js')

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
    new WokCommands(client, {
        commandDir: path.join(__dirname, './commands'), 
        featuresDir: path.join(__dirname, './features'),
        testServers: ['811195710065082378']
    })
    .setDefaultPrefix('?')
    .setBotOwner('591150858830479381')
})

client.login(process.env.BOT_TOKEN)
