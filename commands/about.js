const { MessageEmbed } = require('discord.js')
const fs = require('fs')

module.exports = {
    category: 'Help',
    description: 'About command for information about the bot',

    callback: async () => {
        const embed = new MessageEmbed()
            .setTitle('About')
            .setDescription('Hello, im qxb3 (Zeven / Toolong from the game) I made this bot to help newbies get started to the game and i find it really annoying to forget items especially the materials needed for the enchantments, Anyway i hope this bot can hopefully help you to your mirage realms journey!')
            .addFields([
                { name: '❯ Note', value: 'I am gonna discontinuing this project for secret reasons, Anyway while im gone the bot are still gonna be up and running and if you want you to help with the bot can go ahead and help me, The source code are gonna be below so you can go ahead and contribute\nGithub: https://github.com/qxb3/mirage-bot' },
                { name: '❯ Found a bug?', value: '• Contact me in discord: qxb3#4312' },
                { name: '❯ Support me', value: '• Paypal: https://www.paypal.me/qxb3' },
                { name: '❯ Special thanks', value: '• Anonym - I used his wiki for the items, weapons and other stuff!\nHis wiki: http://mr.golitsyn.com/' }
            ])
            .setColor('BLUE')

        return embed
    }
}
