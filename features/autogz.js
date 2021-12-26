const autoGzSchema = require('@models/autogz-schema')

module.exports = (client) => {
    client.on('messageCreate', async (message) => {
        const attachment = message?.attachments.first()

        if (attachment?.contentType.startsWith('image')) {
            const data = await autoGzSchema.findOne({ _id: message.guild.id })
            if (!data) return

            if (data.channel_id === message.channelId) {
                setTimeout(async () => {
                    await message?.react('🇬')
                    await message?.react('🇿')

                    if (data.message) {
                        await message?.reply(data.message)
                    }
                }, 500)
            } 
        } 
    })
}

module.exports.config = {
    displayName: 'Auto Gz',
    dbName: 'AUTO_GZ'
}
