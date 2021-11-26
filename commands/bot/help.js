const { MessageEmbed } = require('discord.js')
const fs = require('fs')

module.exports = {
    category: 'Help',
    description: 'Help command for the bot',

    slash: 'both',

    callback: ({ prefix }) => {
        const help = JSON.parse(Buffer.from(fs.readFileSync(process.env.PWD + '/assets/help.json').toString()))
        
        let wiki = ''
        help.wiki.commands.forEach((data, i) => {
            wiki += data
            if (i != help.wiki.commands.length-1)
                wiki += ', '
        })

        let items = ''
        help.items.commands.forEach((data, i) => {
            items += data
            if (i != help.items.commands.length-1)
                items += ', '
        })

        let h = ''
        help.help.commands.forEach((data, i) => {
            h += data
            if (i != help.help.commands.length-1)
                h += ', '
        })

        const embed = new MessageEmbed()
            .setTitle('Help - Commands')
            .addFields([
                { name: '❯ Wiki', value: wiki },
                { name: '❯ Items', value: items },
                { name: '❯ Help', value: h },
                { name: '❯ Usage', value: `${prefix}<command>` }
            ])
            .setColor('BLUE')

        return embed
    }
}
