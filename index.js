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

function setBotActivity(client) {
    client.user.setActivity({
        name: 'Mirage Realms',
        type: 'PLAYING'
    })
}

function updateStats(client) {
    if (process.env.PRODUCTION === 'false') return

    const guild = client.guilds.cache.get('811195710065082378')
    const guilds = client.guilds.cache
    setInterval(() => {
        let users = 0
        guilds.forEach((guild) => {
            users += guild.memberCount
        })

        guild.channels.at(0).setName(`Servers: ${client.guilds.cache.size}`)
        guild.channels.at(1).setName(`Users: ${users}`)
    }, 1000 * 30)
}

client.on('ready', () => {
    setBotActivity(client)
    updateStats(client)

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
