const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js')

const sendMessage = require('@utils/send-message')

module.exports = {
    category: 'Bot',
    description: 'About command for information about the bot',

    slash: 'both',

    callback: async ({ message, interaction }) => {
        const row1 = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setLabel('Invite Bot')
                    .setURL('https://discord.com/api/oauth2/authorize?client_id=903372467370864740&permissions=414464788545&scope=bot%20applications.commands')
                    .setStyle('LINK')
            )

        const row2 = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setLabel('Discord Server')
                    .setURL('https://discord.gg/7PKhEk4NAe')
                    .setStyle('LINK')
            )

        const embed = new MessageEmbed()
            .setTitle('About')
            .setThumbnail('attachment://mirage.png')
            .setDescription('MirageHelper is a open source discord bot for mirage realms Made by qxb3#4312 (ZeVEn in game).')
            .addFields([
                { name: '❯ Found a bug? Contact me in', value: '• Discord: qxb3#4312' },
                { name: '❯ Discord Server', value: '• https://discord.gg/7PKhEk4NAe' },
                { name: '❯ Special thanks', value: '• Anonym - I used his wiki for the items, weapons and other stuff!\nHis wiki: http://mr.golitsyn.com/' },
                { name: '❯ Source code', value: 'https://github.com/qxb3/mirage-bot' }
            ])
            .setColor('YELLOW')

        sendMessage(message, interaction, {
            embeds: [ embed ],
            components: [ row1, row2 ],
            files: [ 'assets/icons/mirage.png' ]
        })
    }
}
