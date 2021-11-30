const { MessageEmbed } = require('discord.js')
const Utils = require('../../utils/utils')

const utils = new Utils()
const fs = require('fs')

module.exports = {
    category: 'Bot',
    description: 'About command for information about the bot',

    slash: 'both',

    callback: async ({ message, interaction }) => {
        const embed = new MessageEmbed()
            .setTitle('About')
            .setThumbnail('attachment://mirage.png')
            .setDescription('Hello, im qxb3 (IM NO OB / Zeven / Unknown / Mastermind from the game) I made this bot to help newbies get started to the game and i find it really annoying to forget items especially the materials needed for the enchantments, Anyway i hope this bot can hopefully help you to your mirage realms journey!')
            .addFields([
                { name: '❯ Found a bug? Contact me in', value: '• Discord: qxb3#4312' },
                { name: '❯ Official Discord Server', value: 'https://discord.gg/7PKhEk4NAe' },
                { name: '❯ Support me', value: '• Paypal: https://www.paypal.me/qxb3' },
                { name: '❯ Special thanks', value: '• Anonym - I used his wiki for the items, weapons and other stuff!\nHis wiki: http://mr.golitsyn.com/' }
            ])
            .setColor('YELLOW')

        utils.sendMessage(message, interaction, {
            embeds: [
                embed
            ],
            files: [
                process.env.PWD + '/assets/icons/mirage.png'
            ]
        })
    }
}
