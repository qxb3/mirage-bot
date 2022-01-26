const { MessageEmbed } = require('discord.js')

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

    callback: ({ user, guild, args, client, instance }) => {
        const embed = new MessageEmbed()
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
            .setColor('RED')

        instance._botOwner.forEach(async (id) => {
            const owner = client.users.cache.get(id)
            await owner.send({ embeds: [ embed ] })
        })

        return {
            content: 'Your bug report has been sent!',
            ephemeral: true,
            custom: true
        }
    }
}
