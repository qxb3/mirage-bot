const { MessageEmbed } = require('discord.js')

const Slang = require('../../command_arguments/wiki/slang')
const slang = new Slang()

const Vocations = require('../../command_arguments/wiki/vocations')
const vocations = new Vocations()

module.exports = {
    category: 'Wiki command',
    description: 'A useful information wiki about the game.',

    callback: async ({  message, args, prefix }) => { 
        const username = message.author.username
        const tag = `#${message.author.discriminator}`
        const avatar = `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png`

        const availableWiki = ['slang', 'vocations']
        let wiki = ''
        availableWiki.forEach(data => {
            wiki += `❯ ${data}\n`
        })

        if (args[0] == undefined) {
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
        }
    }
}
