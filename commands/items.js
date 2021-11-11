const { MessageEmbed } = require('discord.js')

const Materials = require('../command_arguments/items/materials')
const materials = new Materials()

module.exports = {
    category: 'Items command',
    description: 'A useful list of items in the game',

    testOnly: true,

    callback: async ({  message, args, prefix }) => { 
        const username = message.author.username
        const tag = `#${message.author.discriminator}`
        const avatar = `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png`

        const availableItemCategories = ['Materials']
        let categories = ''
        availableItemCategories.forEach(data => {
            categories += `❯ ${data}\n`
        })

        if (args[0] == undefined) {
            const embed = new MessageEmbed()
                .setAuthor(username + tag, avatar)
                .setTitle('\nAvailable categories:')
                .setDescription(`${categories}\n\nHint: ${prefix}items <category>`)
                .setColor('DARK_RED')

            return embed
        }

        switch(args[0].toLowerCase()) {
            case 'materials':
            case 'mats':
                return 'Material test'
                break
        }
    }
}
