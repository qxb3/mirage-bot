const { sendMessage } = require('@utils/utils')
const { createEmbed } = require('@utils/responses')

module.exports = {
    category: 'Bot',
    description: 'Suggest on what you want to add to the bot',

    expectedArgs: '<suggestion>',
    minArgs: 1,
    slash: 'both',
    options: [
        {
            name: 'suggestion',
            description: 'The suggestion',
            type: 'STRING',
            required: true
        }
    ],

    callback: async ({ message, interaction, user, guild, args, client, instance }) => {
        const embed = createEmbed()
            .setTitle('SUGGESTION')
            .addFields([
                { name: '❯ User', value: user.tag },
                { name: '❯ UserID', value: user.id },
                { name: '❯ Guild', value: guild.name },
                { name: '❯ GuildID', value: guild.id },
                { name: '❯ Suggestion', value: args.join(' ') }
            ])
            .setThumbnail(user.displayAvatarURL({ dynamic: true }))
            .setTimestamp()

        instance._botOwner.forEach(async (id) => {
            const owner = client.users.cache.get(id)
            await owner.send({ embeds: [ embed ] })
        })

        await sendMessage(message, interaction, {
            content: 'Your suggestion has been sent!',
            ephemeral: true
        }, { reply: true })
    }
}
