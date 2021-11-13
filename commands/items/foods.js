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
    description: 'A command that helps you find and indentify foods in the game',

    callback: async ({ message, args, prefix }) => {
        const username = message.author.username
        const tag = `#${message.author.discriminator}`
        const avatar = `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png`

        const foodJson = JSON.parse(Buffer.from(fs.readFileSync(process.env.PWD + '/assets/items/foods.json').toString()))
        const categories = []
        foodJson.forEach(material => {
            categories.push(material.name)
        })

        //If there is no argument defined
        if (args[0] == undefined) {
            return new MessageEmbed() 
                .setAuthor(username + tag, avatar)
                .addField('❯ Usage', `${prefix}foods <food>\n${prefix}foods list - To lists all foods in the game`)
                .setColor('RED')
        }

        //List the foods
        if (ignoreCase.equals(args[0], 'list')) {
            const list = getCategories(categories)
            return new MessageEmbed() 
                .setAuthor(username + tag, avatar)
                .addField('❯ Foods', list)
                .addField('❯ Usage', `${prefix}foods <food>`)
                .setColor('BLUE')
        }

        //Show full details of a food
        if (!ignoreCase.equals(args[0], 'list')) {
            let code = 1
            foodJson.forEach(food => {
                if (ignoreCase.equals(args.join(' '), food.name)) {
                    code = 0

                    let monsters = ''
                    food.monsters.forEach(monster => {
                        monsters += `• ${monster}\n`
                    })

                    const embed = new MessageEmbed()
                        .setAuthor(username + tag, avatar)
                        .addFields([
                            { name: '❯ Name', value: food.name },
                            { name: '❯ Time', value: food.time },
                            { name: '❯ Monsters', value: monsters },
                        ])
                        .setColor('BLUE')

                    message.reply({
                        embeds: [embed]
                    })
                }
            })

            //If the food user typed didn't exist
            if (code == 1) {
                const embed = new MessageEmbed()
                    .setAuthor(username + tag, avatar)
                    .setDescription('Make sure the food you type is valid')
                    .addField('❯ Usage', `${prefix}foods list - To list all food in the game` )
                    .setColor('RED')

                return embed
            }
        }
    }
}
