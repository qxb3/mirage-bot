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
            .setDescription('Hello, im qxb3 (ZeVen from the game) I made this bot to help newbies get started to the game and i find it really annoying to forget items especially the materials needed for the enchantments, Anyway i hope this bot can hopefully help you to your mirage realms journey!')
            .addFields([
                { name: '❯ Found a bug? Contact me in', value: '• Discord: qxb3#4312' },
                { name: '❯ Discord Server', value: '• https://discord.gg/7PKhEk4NAe' },
                /*{ name: '❯ Support me', value: '• Paypal: https://www.paypal.me/qxb3' },*/
                { name: '❯ Special thanks', value: '• Anonym - I used his wiki for the items, weapons and other stuff!\nHis wiki: http://mr.golitsyn.com/' }
            ])
            .setColor('YELLOW')

        sendMessage(message, interaction, {
            embeds: [ embed ],
            components: [ row1, row2 ],
            files: [ 'assets/icons/mirage.png' ]
        })
    }
}
