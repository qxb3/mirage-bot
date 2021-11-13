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

        const materialJson = JSON.parse(Buffer.from(fs.readFileSync(process.env.PWD + '/assets/items/materials.json').toString()))
        const categories = []
        materialJson.forEach(material => {
            categories.push(material.name)
        })

        //If there is no argument defined
        if (args[0] == undefined) {
            return new MessageEmbed() 
                .setAuthor(username + tag, avatar)
                .addField('❯ Usage', `${prefix}materials <material>\n${prefix}materials list - To lists all materials in the game`)
                .setColor('RED')
        }

        //List the materials
        if (ignoreCase.equals(args[0], 'list')) {
            const list = getCategories(categories)
            return new MessageEmbed() 
                .setAuthor(username + tag, avatar)
                .addField('❯ Materials', list)
                .addField('❯ Usage', `${prefix}materials <material>`)
                .setColor('BLUE')
        }

        //Show full details of a material
        if (!ignoreCase.equals(args[0], 'list')) {
            let code = 1
            materialJson.forEach(material => {
                if (ignoreCase.equals(args.join(' '), material.name)) {
                    code = 0

                    let dropsFrom = ''
                    material.drops_from.forEach(mob => {
                        dropsFrom += `• ${mob}\n`
                    })

                    const embed = new MessageEmbed()
                        .setAuthor(username + tag, avatar)
                        .addFields([
                            { name: '❯ Name', value: material.name },
                            { name: '❯ Price', value: material.price },
                            { name: '❯ Drops from', value: dropsFrom },
                        ])
                        .setColor('BLUE')

                    message.reply({
                        embeds: [embed]
                    })
                }
            })

            //If the material user typed didn't exist
            if (code == 1) {
                const embed = new MessageEmbed()
                    .setAuthor(username + tag, avatar)
                    .setDescription('Make sure the material you type is valid')
                    .addField('❯ Usage', `${prefix}materials list - To list all materials in the game` )
                    .setColor('RED')

                return embed
            }
        }
    }
}
