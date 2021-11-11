const { MessageEmbed } = require('discord.js')
const ignoreCase = require('ignore-case')

const Slang = require('../command_arguments/wiki/slang')
const slang = new Slang()

const Vocations = require('../command_arguments/wiki/vocations')
const vocations = new Vocations()

const Enchantments = require('../command_arguments/wiki/enchantments')
const enchantments = new Enchantments()

module.exports = {
    category: 'Information',
    description: 'A useful wiki about stuff in the game.',
    expectedArgs: '<category> [optional args]',

    callback: async ({  message, args, prefix }) => { 
        const username = message.author.username
        const tag = `#${message.author.discriminator}`
        const avatar = `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png`

        const availableWiki = ['Slang', 'Vocations', 'Enchantments']
        let wiki = ''
        availableWiki.forEach(data => {
            wiki += `❯ ${data}\n`
        })

        if (args[0] == undefined || (args[0] != undefined && ignoreCase.equals(args[0], 'list'))) {
            const embed = new MessageEmbed()
                .setAuthor(username + tag, avatar)
                .setTitle('\nAvailable wikis:')
                .setDescription(`${wiki}\n\nHint: ${prefix}wiki <wiki>`)
                .setColor('DARK_RED')

            return embed
        }

        switch(args[0]) {
            case 'slang':
            case 'slangs':
                await slang.run(username + tag, avatar, message, args[1], prefix)
                break
            case 'voc':
            case 'vocs':
            case 'vocation':
            case 'vocations':
                await vocations.run(username + tag, avatar, message, args[1], prefix)
                break
            case 'enchant':
            case 'enchants':
            case 'enchantment':
            case 'enchantments':
                await enchantments.run(username + tag, avatar, message, args[1], prefix)
                break
        }
    }
}
