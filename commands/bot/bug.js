const { sendMessage } = require('@utils/utils')
const { createEmbed } = require('@utils/responses')
const { BrandingColors } = require('@utils/constants')

module.exports = {
    category: 'Bot',
    description: 'Report a bug',

    expectedArgs: '<bug>',
    minArgs: 1,
    slash: 'both',
    options: [
        {
            name: 'bug',
            description: 'The suggestion',
            type: 'STRING',
            required: true
        }
    ],

    callback: async ({ message, interaction, user, guild, args, client, instance }) => {
        const embed = createEmbed({ color: BrandingColors.Error })
            .setTitle('BUG')
            .addFields([
                { name: '❯ User', value: user.tag },
                { name: '❯ UserID', value: user.id },
                { name: '❯ Guild', value: guild.name },
                { name: '❯ GuildID', value: guild.id },
                { name: '❯ Bug', value: args.join(' ') }
            ])
            .setThumbnail(user.displayAvatarURL({ dynamic: true }))
            .setTimestamp()

        instance._botOwner.forEach(async (id) => {
            const owner = client.users.cache.get(id)
            await owner.send({ embeds: [ embed ] })
        })

        await sendMessage(message, interaction, {
            content: 'Your bug report has been sent!',
            ephemeral: true
        })
    }
}
