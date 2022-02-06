const { sendMessage, getServerTime } = require('@utils/utils')
const { createEmbed } = require('@utils/responses')

module.exports = {
    category: 'Utilities',
    description: 'Get the mirage realms server time.',
    aliases: ['st'],

    slash: 'both',

    callback: async ({ message, interaction, user }) => {
        const servertime = getServerTime()
        const embed = createEmbed({ user })
            .setThumbnail('attachment://rules.png')
            .addField('❯ Server Time', `Time: ${servertime.military}`)
            .setTimestamp()

        await sendMessage(message, interaction, {
            embeds: [ embed ],
            files: [ 'assets/icons/rules.png' ]
        })
    }
}
