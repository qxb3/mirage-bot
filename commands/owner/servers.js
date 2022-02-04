const { sendMessage } = require('@utils/utils')
const { createEmbed } = require('@utils/responses')
const { BrandingColors } = require('@utils/constants')

module.exports = {
    category: 'Owner',
    description: 'Get servers bot joined to.',
    aliases: ['server'],

    testOnly: true,
    ownerOnly: true,

    callback: async ({ message, client }) => {
        const servers = []
        client.guilds.cache.forEach(guild => {
            servers.push({
                name: `❯ ${guild.name}`,
                value: `Guild ID: ${guild.id}\n` +
                       `Member count: ${guild.memberCount}`
            })
        })

        const embed = createEmbed()
            .setTitle('Servers')
            .addFields(servers)

        await sendMessage(message, undefined, {
            embeds: [ embed ]
        }, { reply: true })
    },

    error: () => {}
}
