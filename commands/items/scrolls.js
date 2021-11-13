const { MessageEmbed } = require('discord.js')
const ignoreCase = require('ignore-case')
const fs = require('fs')

const getCategories = (categories) => {
    let list = ''
    categories.forEach(category => {
        list += `• ${category}\n`
    })
    return list
}

module.exports = {
    category: 'Items',
    description: 'A command that helps you find and indentify materials in the game',

    callback: async ({ message, args, prefix }) => {
        const username = message.author.username
        const tag = `#${message.author.discriminator}`
        const avatar = `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png`

        const scrollJson = JSON.parse(Buffer.from(fs.readFileSync(process.env.PWD + '/assets/items/scrolls.json').toString()))
        const categories = []
        scrollJson.forEach(scroll => {
            categories.push(scroll.name)
        })

        //If there is no argument defined
        if (args[0] == undefined) {
            return new MessageEmbed() 
                .setAuthor(username + tag, avatar)
                .addField('❯ Usage', `${prefix}scrolls <scroll>\n${prefix}scrolls list - To lists all scrolls in the game`)
                .setColor('RED')
        }

        //List the scrolls
        if (ignoreCase.equals(args[0], 'list')) {
            const list = getCategories(categories)
            return new MessageEmbed() 
                .setAuthor(username + tag, avatar)
                .addField('❯ Materials', list)
                .addField('❯ Usage', `${prefix}scrolls <scrolls>`)
                .setColor('BLUE')
        }

        //Show full details of a scroll
        if (!ignoreCase.equals(args[0], 'list')) {
            let code = 1
            scrollJson.forEach(scroll => {
                if (ignoreCase.equals(args.join(' '), scroll.name)) {
                    code = 0

                    let effects = ''
                    scroll.effects.forEach(effect => {
                        effects += `• ${effect}\n`
                    })

                    const embed = new MessageEmbed()
                        .setAuthor(username + tag, avatar)
                        .addFields([
                            { name: '❯ Name', value: scroll.name },
                            { name: '❯ Effects', value: effects }
                        ])
                        .setColor('BLUE')

                    message.reply({
                        embeds: [embed]
                    })
                }
            })

            //If the scroll user typed didn't exist
            if (code == 1) {
                const embed = new MessageEmbed()
                    .setAuthor(username + tag, avatar)
                    .setDescription('Make sure the scroll you type is valid')
                    .addField('❯ Usage', `${prefix}scrolls list - To list all scrolls in the game` )
                    .setColor('RED')

                return embed
            }
        }
    }
}
