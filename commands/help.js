const { MessageEmbed } = require('discord.js')
const fs = require('fs')

module.exports = {
    category: 'Help',
    description: 'Help command for the bot',

    callback: async ({ prefix }) => {

        const help = JSON.parse(Buffer.from(fs.readFileSync(process.env.PWD + '/assets/help.json').toString()))
        let wiki = ''
        help.wiki.commands.forEach(data => {
            wiki += `• ${prefix + data}\n`
        })

        let items = ''
        help.items.commands.forEach(data => {
            items += `• ${prefix + data}\n`
        })

        let h = ''
        help.help.commands.forEach(data => {
            h += `• ${prefix + data}\n`
        })

        const embed = new MessageEmbed()
            .setTitle('Help - Commands')
            .addFields([
                { name: '❯ Wiki', value: wiki },
                { name: '❯ Items', value: items },
                { name: '❯ Help', value: h }
            ])
            .setColor('BLUE')

        return embed
    }
}
