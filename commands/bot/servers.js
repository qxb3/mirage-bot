const { MessageEmbed } = require('discord.js')
const Utils = require('../../utils/utils')
const utils = new Utils()

module.exports = {
    category: 'Utils',
    description: 'Get servers bot joined to.',
    Permissions: ['ADMINISTRATOR', 'MODERATOR'],

    slash: 'both',
    testOnly: true,

    callback: async ({ message, interaction, client }) => {
        const servers = []
        client.guilds.cache.forEach(guild => {
            servers.push({
                name: `❯ ${guild.name}`,
                value: `Member count: ${guild.memberCount}`
            })
        })

        const embed = new MessageEmbed()
            .setTitle('Servers')
            .addFields(servers)
            .setColor('GREEN')

        utils.sendMessage(message, interaction, {
            embeds: [
                embed
            ],
            ephemeral: true
        })
    }
}
