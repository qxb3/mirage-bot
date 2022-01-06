const getServerTime = require('@utils/get-server-time')
const getEmbed = require('@utils/get-embed')

module.exports = {
    category: 'Utilities',
    description: 'Get the mirage realms server time.',
    aliases: ['st'],

    slash: 'both',

    callback: ({ message, interaction, user }) => {
        const servertime = getServerTime()
        const embed = getEmbed(user)
            .setThumbnail('attachment://rules.png')
            .addField('❯ Server Time', `Time: ${servertime.converted}`)
            .setTimestamp()

        if (message) {
            message.channel.send({
                embeds: [ embed ],
                files: [ 'assets/icons/rules.png' ]
            })
        }

        if (interaction) {
            interaction.reply({
                embeds: [ embed ],
                files: [ 'assets/icons/rules.png' ]
            })
        }
    }
}
