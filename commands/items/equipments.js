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

const getEquipments = (weaponJson, type) => {
    let equipments = ''
    weaponJson.filter(equipment => ignoreCase.equals(type, equipment.type))
        .forEach(equipment => {
            equipments += `• ${equipment.name}\n`
    })
    return equipments
}

module.exports = {
    category: 'Items',
    description: 'A equipments command to help you find and indentify equipments on the game',

    callback: async ({ message, args, prefix }) => {
        const username = message.author.username
        const tag = `#${message.author.discriminator}`
        const avatar = `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png`

        const equipmentJson = JSON.parse(Buffer.from(fs.readFileSync(process.env.PWD + '/assets/items/equipments.json').toString()))
        const categories = ['Helmet', 'Chest', 'Gloves', 'Boots', 'Ring', 'Necklace']

        //If there is no argument defined
        if (args[0] == undefined) {
            return new MessageEmbed() 
                .setAuthor(username + tag, avatar)
                .addField('❯ Usage', `${prefix}equipments <equipment>\n${prefix}equpiments list - To lists all equpiments category`)
                .setColor('RED')
        }

        if (ignoreCase.equals(args[0], 'list')) {
            //List the equipmemts
            if (args[1] != undefined) {
                let code = 1
                categories.forEach(category => {
                    if (ignoreCase.equals(args[1], category)) {
                        code = 0

                        const equipments = getEquipments(equipmentJson, args[1])
                        const embed = new MessageEmbed()
                            .setAuthor(username + tag, avatar)
                            .addFields([
                                { name: `❯ ${category} - List`, value: equipments },
                                { name: '❯ Usage', value: `${prefix}equipments <equipment>` }
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
                        .addField('❯ Usage', `${prefix}equipments list <category>`)
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
                    .addField('❯ Usage', `${prefix}equipments <equipment>`)
                    .setColor('BLUE')
            }
        }

        //Show full details of a equipment
        if (!ignoreCase.equals(args[0], 'list')) {
            let code = 1
            equipmentJson.forEach(equipment => {
                if (ignoreCase.equals(args.join(' '), equipment.name)) {
                    code = 0

                    let stats = ''
                    equipment.stats.forEach(stat => {
                        stats += `• ${stat}\n`
                    })

                    let monsters = ''
                    equipment.monsters.forEach(monster => {
                        monsters += `• ${monster}\n`
                    })

                    const embed = new MessageEmbed()
                        .setAuthor(username + tag, avatar)
                        .addFields([
                            { name: '❯ Name', value: equipment.name },
                            { name: '❯ Requirements', value: equipment.requirements },
                            { name: '❯ Stats', value: stats },
                            { name: '❯ Monsters', value: monsters }
                        ])
                        .setColor('BLUE')

                    message.reply({
                        embeds: [embed]
                    })
                }
            })

            //If the equipment user input didn't exist
            if (code == 1) {
                const embed = new MessageEmbed()
                    .setAuthor(username + tag, avatar)
                    .setDescription('Make sure the equipment you type is valid')
                    .addField('❯ Usage', `${prefix}equipments list <category>`)
                    .setColor('RED')

                return embed
            }
        }
    }
}
