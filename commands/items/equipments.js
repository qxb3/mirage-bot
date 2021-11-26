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

const sendMessage = (message, interaction, content) => {
    if (message) {
        message.channel.send(content)
    }

   if (interaction) {
        interaction.reply(content)
    }
}

module.exports = {
    category: 'Items',
    description: 'A equipments command to help you find and indentify equipments on the game',

    callback: async ({ message, interaction, args, prefix }) => {
        let author = ''
        let avatar = ''

        if (message) {
            author = message.author.username + '#' + message.author.discriminator
            avatar = `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png`
        }

        if (interaction) {
            author = interaction.user.username + '#' + interaction.user.discriminator
            avatar = `https://cdn.discordapp.com/avatars/${interaction.user.id}/${interaction.user.avatar}.png`
            prefix = '/'
        }

        const equipmentJson = JSON.parse(Buffer.from(fs.readFileSync(process.env.PWD + '/assets/items/equipments.json').toString()))
        const categories = ['Helmet', 'Chest', 'Gloves', 'Boots', 'Ring', 'Necklace']

        //If there is no argument defined
        if (args[0] == undefined) {
            const embed = new MessageEmbed() 
                .setAuthor(author, avatar)
                .addField('❯ Usage', `${prefix}equipments <equipment>\n${prefix}equpiments list - To lists all equpiments category`)
                .setColor('RED')

            return sendMessage(message, interaction, { embeds: [ embed ] })
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
                            .setAuthor(author, avatar)
                            .addFields([
                                { name: `❯ ${category} - List`, value: equipments },
                                { name: '❯ Usage', value: `${prefix}equipments <equipment>` }
                            ])
                            .setColor('BLUE')

                        return sendMessage(message, interaction, {
                            embeds: [ embed ]
                        })
                    }
                })

                //If the category entered by user is not valid
                if (code == 1) {
                    const list = getCategories(categories)
                    const embed = new MessageEmbed() 
                        .setAuthor(author, avatar)
                        .setDescription('You forgot the categories? Jesus christ, here you go!')
                        .addField('❯ Categories', list)
                        .addField('❯ Usage', `${prefix}equipments list <category>`)
                        .setColor('RED')

                    return sendMessage(message, interaction, {
                        embeds: [ embed ]
                    })
                }
            } 

            //List of categories
            else {
                const list = getCategories(categories)
                const embed = new MessageEmbed() 
                    .setAuthor(author, avatar)
                    .addField('❯ Categories', list)
                    .addField('❯ Usage', `${prefix}equipments <equipment>`)
                    .setColor('BLUE')

                return sendMessage(message, interaction, {
                    embeds: [ embed ]
                })
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
                        .setAuthor(author, avatar)
                        .addFields([
                            { name: '❯ Name', value: equipment.name },
                            { name: '❯ Requirements', value: equipment.requirements },
                            { name: '❯ Stats', value: stats },
                            { name: '❯ Monsters', value: monsters }
                        ])
                        .setColor('BLUE')

                    return sendMessage(message, interaction, {
                        embeds: [ embed ]
                    })
                }
            })

            //If the equipment user input didn't exist
            if (code == 1) {
                const embed = new MessageEmbed()
                    .setAuthor(author, avatar)
                    .setDescription('Make sure the equipment you type is valid')
                    .addField('❯ Usage', `${prefix}equipments list <category>`)
                    .setColor('RED')

                return embed
            }
        }
    }
}
