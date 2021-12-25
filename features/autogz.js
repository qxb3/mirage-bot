const autoGzSchema = require('@models/autogz-schema')

module.exports = (client) => {
    client.on('messageCreate', async (message) => {
        const data = await autoGzSchema.findOne({ _id: message.guild.id })
        if (!data) return

        if (data.channel_id === message.channelId) {
            const attachment = message.attachments.first()
            if (attachment?.contentType === 'image/jpeg') {
                message?.react('🇬')
                message?.react('🇿')

                if (data.message) {
                    message?.reply(data.message)
                }
            }
        }
    })
}

module.exports.config = {
    displayName: 'Auto Gz',
    dbName: 'AUTO_GZ'
}
