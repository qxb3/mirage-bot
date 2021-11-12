const { MessageEmbed } = require('discord.js')
const ignoreCase = require('ignore-case')

const Materials = require('../command_arguments/items/materials')
const materials = new Materials()

module.exports = {
    category: 'Items command',
    description: 'A useful list of items in the game',

    callback: async ({  message, args, prefix }) => { 
        const username = message.author.username
        const tag = `#${message.author.discriminator}`
        const avatar = `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png`

        const category = args[0]

        const availableItemCategories = ['Weapons (X)', 'Armours (X)', 'Gloves (X)', 'Boots (X)', 'Materials (Y)', 'Foods (X)']
        let categories = ''
        availableItemCategories.forEach(data => {
            categories += `• ${data}\n`
        })

        if (category == undefined) {
            return new MessageEmbed()
                .setAuthor(username + tag, avatar)
                .setDescription(`Error! Invalid <category>`)
                .addFields([
                    { name: 'Categories', value: categories },
                    { name: 'Usage', value: `${prefix}items <category>` }
                ])
        } else if (category != undefined && ignoreCase.equals(category, 'list')) {
            return new MessageEmbed()
                .setAuthor(username + tag, avatar)
                .addFields([
                    { name: 'Categories', value: categories },
                    { name: 'Usage', value: `${prefix}items <category>` }
                ])
        }

        args.shift()
        const material = args.join(' ')

        switch(category) {
            case 'materials':
                materials.run(username + tag, avatar, message, material, prefix)
                break
        }
    }
}
