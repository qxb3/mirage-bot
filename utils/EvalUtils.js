class EvalUtils {

    //Utility Functions
    static async sendMessage(client, guildId, channelId, message) {
        const guild = client.guilds.cache.get(guildId)
        const channel = await guild.channels.fetch(channelId)
        await channel.send(message)
    }

    static async replyMessage(client, guildId, channelId, messageId, message) {
        const guild = client.guilds.cache.get(guildId)
        const channel = await guild.channels.fetch(channelId)
        const msg = await channel.messages.fetch(messageId)
        await msg.reply(message)
    }

    static getServersSize(client) {
        return client.guilds.cache.size
    }

    static getUsersSize(client) {
        return client.users.cache.size
    }

    static getTotalUsersSize(client) {
        let users = 0
        client.guilds.cache.forEach((guild) => {
            users += guild.memberCount
        })
        return users
    }

    static list() {
        return 'sendMessage(client, guildId, channelId, message)\n' +
               'replyMessage(client, guildId, channelId, messageId, message)\n' +
               'getServersSize(client)\n' +
               'getUsersSize(client)\n' +
               'getTotalUsersSize(client)'
    }

    //Utils
    static clean(text) {
        /*if (text && text.constructor.name == 'Promise') {
            text = await text
        }*/

        if (typeof text !== 'string') {
            text = require('util').inspect(text, { depth: 1 })
        }

        /*text = text.replaceAll('`', '`' + String.fromCharCode(8203))
        text = text.replaceAll('@', '@' + String.fromCharCode(8203));*/
        text = text.replaceAll(process.env.TOKEN, ' ')
        text = text.replaceAll(process.env.MONGO_URI, ' ')

        return text
    }

    static quote(message) {
        return '```js\n' + message + '\n```'
    }
}

module.exports = EvalUtils
