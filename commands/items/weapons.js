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

const getWeapons = (weaponJson, type) => {
    let weapons = ''
    weaponJson.filter(weapon => ignoreCase.equals(type, weapon.type))
        .forEach(weapon => {
            weapons += `• ${weapon.name}\n`
    })
    return weapons
}

module.exports = {
    category: 'Items',
    description: 'A weapons command to help you find and indentify weapons',

    callback: async ({ message, args, prefix }) => {
        const username = message.author.username
        const tag = `#${message.author.discriminator}`
        const avatar = `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png`

        const weaponJson = JSON.parse(Buffer.from(fs.readFileSync(process.env.PWD + '/assets/items/weapons.json').toString()))
        const categories = ['Sword', 'Axe', 'Mace', 'Shield', 'Bow', 'Ammunition', 'Staff', 'Rod', 'Spellbook']

        //If there is no argument defined
        if (args[0] == undefined) {
            return new MessageEmbed() 
                .setAuthor(username + tag, avatar)
                .addField('❯ Usage', `${prefix}weapons <weapon>\n${prefix}weapons list - To lists all weapons category`)
                .setColor('RED')
        }

        if (ignoreCase.equals(args[0], 'list')) {
            //List the weapons
            if (args[1] != undefined) {
                let code = 1
                categories.forEach(category => {
                    if (ignoreCase.equals(args[1], category)) {
                        code = 0

                        const weapons = getWeapons(weaponJson, args[1])
                        const embed = new MessageEmbed()
                            .setAuthor(username + tag, avatar)
                            .addFields([
                                { name: `❯ ${category} - List`, value: weapons },
                                { name: '❯ Usage', value: `${prefix}weapons <weapon>` }
                            ])
                            .setColor('BLUE')

                        message.reply({
                            embeds: [embed]
                        })
                    }
                })

                //If the category entered by user is not valid
                if (code == 1) {
                    const list = getCategories(categories)
                    const embed = new MessageEmbed() 
                        .setAuthor(username + tag, avatar)
                        .setDescription('You forgot the categories? Jesus christ, here you go!')
                        .addField('❯ Categories', list)
                        .addField('❯ Usage', `${prefix}weapons list <category>`)
                        .setColor('RED')

                    return message.reply({
                        embeds: [embed]
                    })
                }
            } 

            //List of categories
            else {
                const list = getCategories(categories)
                return new MessageEmbed() 
                    .setAuthor(username + tag, avatar)
                    .addField('❯ Categories', list)
                    .addField('❯ Usage', `${prefix}weapons list <category>`)
                    .setColor('BLUE')
            }
        }

        //Show full details of a weapon
        if (!ignoreCase.equals(args[0], 'list')) {
            let code = 1
            weaponJson.forEach(weapon => {
                if (ignoreCase.equals(args.join(' '), weapon.name)) {
                    code = 0

                    let stats = ''
                    weapon.stats.forEach(stat => {
                        stats += `• ${stat}\n`
                    })

                    let monsters = ''
                    weapon.drops_from.forEach(monster => {
                        monsters += `• ${monster}\n`
                    })

                    const embed = new MessageEmbed()
                        .setAuthor(username + tag, avatar)
                        .addFields([
                            { name: '❯ Name', value: weapon.name },
                            { name: '❯ Requirements', value: weapon.requirements },
                            { name: '❯ Stats', value: stats },
                            { name: '❯ Monsters', value: monsters }
                        ])
                        .setColor('BLUE')

                    message.reply({
                        embeds: [embed]
                    })
                }
            })

            //If the weapon user input didn't exist
            if (code == 1) {
                const embed = new MessageEmbed()
                    .setAuthor(username + tag, avatar)
                    .setDescription('Make sure the weapon you type is valid')
                    .addField('❯ Usage', `${prefix}weapons list <category>`)
                    .setColor('RED')

                return embed
            }
        }
    }
}
