const { MessageEmbed } = require('discord.js')
const fs = require('fs')

module.exports = {
    category: 'Help',
    description: 'Help command for the bot',

    callback: async ({ message, prefix }) => {
        const username = message.author.username
        const tag = `#${message.author.discriminator}`
        const avatar = `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png`

        const help = JSON.parse(Buffer.from(fs.readFileSync(process.env.PWD + '/assets/help.json').toString()))
        let wiki = ''
        help.wiki.commands.forEach(data => {
            wiki += `• ${prefix + data}\n`
        })

        let items = ''
        help.items.commands.forEach(data => {
            items += `• ${prefix + data}\n`
        })

        const embed = new MessageEmbed()
            .setTitle('Help - Commands')
            .addFields([
                { name: '❯ Wiki', value: wiki },
                { name: '❯ Items', value: items }
            ])
            .setColor('BLUE')

        return embed
    }
}
