const { MessageEmbed } = require('discord.js')
const Utils = require('../../utils/utils')

const utils = new Utils()
const fs = require('fs')

module.exports = {
    category: 'Help',
    description: 'About command for information about the bot',

    slash: 'both',

    callback: async ({ message, interaction }) => {
        const embed = new MessageEmbed()
            .setTitle('About')
            .setDescription('Hello, im qxb3 (IM NO OB / Unknown / Mastermind from the game) I made this bot to help newbies get started to the game and i find it really annoying to forget items especially the materials needed for the enchantments, Anyway i hope this bot can hopefully help you to your mirage realms journey!')
            .addFields([
                { name: '❯ Found a bug? Contact me in', value: '• discord: qxb3#4312' },
                { name: '❯ Support me', value: '• Paypal: https://www.paypal.me/qxb3' },
                { name: '❯ Special thanks', value: '• Anonym - I used his wiki for the items, weapons and other stuff!\nHis wiki: http://mr.golitsyn.com/' }
            ])
            .setColor('YELLOW')

        utils.sendMessage(message, interaction, {
            embeds: [
                embed
            ]
        })
    }
}
