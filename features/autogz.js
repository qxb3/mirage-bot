const autoGzSchema = require('@models/autogz-schema')
const randomNumber = require('@utils/random-number')

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

                    const random = randomNumber(0, data.messages.length-1)
                    const randomMessage = data.messages[random]
                        ?.replace(/{mention}/g, `<@${message?.author.id}>`)
                        ?.replace(/{server}/g, message.guild.name)

                    if (randomMessage) {
                        await message?.reply(randomMessage)
                    }
                }, 1000)
            } 
        } 
    })
}

module.exports.config = {
    displayName: 'Auto Gz',
    dbName: 'AUTO_GZ'
}
