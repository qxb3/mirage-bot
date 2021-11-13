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
    description: 'A command that helps you find and indentify potions in the game',

    callback: async ({ message, args, prefix }) => {
        const username = message.author.username
        const tag = `#${message.author.discriminator}`
        const avatar = `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png`

        const potionJson = JSON.parse(Buffer.from(fs.readFileSync(process.env.PWD + '/assets/items/potions.json').toString()))
        const categories = []
        potionJson.forEach(potion => {
            categories.push(potion.name)
        })

        //If there is no argument defined
        if (args[0] == undefined) {
            return new MessageEmbed() 
                .setAuthor(username + tag, avatar)
                .addField('❯ Usage', `${prefix}potions <potion>\n${prefix}potions list - To lists all potions in the game`)
                .setColor('RED')
        }

        //List the potions
        if (ignoreCase.equals(args[0], 'list')) {
            const list = getCategories(categories)
            return new MessageEmbed() 
                .setAuthor(username + tag, avatar)
                .addField('❯ Potions', list)
                .addField('❯ Usage', `${prefix}potions <potion>`)
                .setColor('BLUE')
        }

        //Show full details of a potion
        if (!ignoreCase.equals(args[0], 'list')) {
            let code = 1
            potionJson.forEach(potion => {
                if (ignoreCase.equals(args.join(' '), potion.name)) {
                    code = 0

                    let effects = ''
                    potion.effects.forEach(effect => {
                        effects += `• ${effect}\n`
                    })

                    let monsters = ''
                    potion.monsters.forEach(monster => {
                        monsters += `• ${monster}\n`
                    })

                    const embed = new MessageEmbed()
                        .setAuthor(username + tag, avatar)
                        .addFields([
                            { name: '❯ Name', value: potion.name },
                            { name: '❯ Effects', value: effects },
                            { name: '❯ Monsters', value: monsters },
                        ])
                        .setColor('BLUE')

                    message.reply({
                        embeds: [embed]
                    })
                }
            })

            //If the potion user typed didn't exist
            if (code == 1) {
                const embed = new MessageEmbed()
                    .setAuthor(username + tag, avatar)
                    .setDescription('Make sure the potion you type is valid')
                    .addField('❯ Usage', `${prefix}potion list - To list all food in the game` )
                    .setColor('RED')

                return embed
            }
        }
    }
}
