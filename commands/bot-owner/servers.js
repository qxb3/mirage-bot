const { MessageEmbed } = require('discord.js')
const sendMessage = require('../../utils/send-message')

module.exports = {
    category: 'BotOwner',
    description: 'Get servers bot joined to.',
    aliases: ['server'],

    slash: true,
    testOnly: true,
    ownerOnly: true,

    callback: async ({ message, interaction, client }) => {
        const servers = []
        client.guilds.cache.forEach(guild => {
            servers.push({
                name: `❯ ${guild.name}`,
                value: `Guild ID: ${guild.id}\n` +
                       `Member count: ${guild.memberCount}`
            })
        })

        const embed = new MessageEmbed()
            .setTitle('Servers')
            .addFields(servers)
            .setColor('GREEN')

        sendMessage(message, interaction, {
            embeds: [
                embed
            ],
            ephemeral: true
        })
    }
}
