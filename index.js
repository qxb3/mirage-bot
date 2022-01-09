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
    setBotActivity()

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

function setBotActivity() {
    let index = 0
    setInterval(() => {
        let users = 0
        client.guilds.cache.forEach((guild) => users += guild.memberCount)
        const activities = [
            { name: 'Mirage Realms', type: 'PLAYING' },
            { name: 'Noobs get killed by imps', type: 'WATCHING' },
            { name: `?help on ${client.guilds.cache.size} servers`, type: 'WATCHING' },
            { name: `?help on ${users} users`, type: 'WATCHING' }
        ]

        client.user.setActivity(activities[index])
        index++
        if (index >= activities.length) {
            index = 0
        }
    }, 1000 * 60) 
}

client.login(process.env.TOKEN)
