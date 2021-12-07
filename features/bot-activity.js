const setBotActivity = require('../utils/set-bot-activity')

module.exports = (client) => {
    client.on('guildCreate', () => {
        setBotActivity(client)
    })

    client.on('guildDelete', () => {
        setBotActivity(client)
    })
}

module.exports.config = {
    displayName: 'Set Bot Activity',
    dbName: 'BOT_ACTIVITY'
}
