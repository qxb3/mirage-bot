const { MessageEmbed } = require('discord.js')

module.exports = {
    category: 'Mock command',
    description: 'Lets fuck krim',

    testOnly: true,

    callback: async ({  message, args, prefix }) => { 
        const username = message.author.username
        const tag = `#${message.author.discriminator}`
        const avatar = `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png`

        return 'Fuck you <@563863746943123461>'
    }
}
