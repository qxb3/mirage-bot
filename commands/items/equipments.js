const { MessageEmbed } = require('discord.js')
const Utils = require('../../utils/utils')

const ignoreCase = require('ignore-case')
const utils = new Utils()
const fs = require('fs')

const getCategories = (categories) => {
    let list = ''
    categories.forEach(category => {
        list += `• ${category}\n`
    })
    return list
}

const getWeapons = (equipmentJson, type) => {
    let weapons = ''
    equipmentJson.filter(weapon => ignoreCase.equals(type, weapon.type))
        .forEach(weapon => {
            weapons += `• ${weapon.name}\n`
    })
    return weapons
}

module.exports = {
    category: 'Items',
    description: 'A command that will help you for equipments in the game',
    aliases: ['equipment', 'equips', 'equip'],

    slash: 'both',

    expectedArgs: '<equipment>',
    options: [
        {
            name: 'equipment',
            description: 'It can be the name of the equipment or a category.',
            required: false,
            type: 3
        }
    ],

    callback: async ({ message, interaction, args, prefix }) => {
        const messageDetails = utils.getMessageDetails(message, interaction, prefix)

        const equipmentJson = JSON.parse(Buffer.from(fs.readFileSync(process.env.PWD + '/assets/items/equipments.json').toString()))
        const categories = ['Helmet', 'Chest', 'Gloves', 'Boots', 'Ring', 'Necklace']

        if (!args[0]) {
            const list = getCategories(categories)
            const embed = new MessageEmbed()
                .setAuthor(messageDetails.author, messageDetails.avatar)
                .addField('❯ Categories', list)
                .addField('❯ Usage', `${messageDetails.prefix}equipments - To list all equipment categories in the game\n${messageDetails.prefix}equipments <category> - To list all the equipments in that category`)
                .setColor('BLUE')

            return utils.sendMessage(message, interaction, {
                embeds: [
                    embed
                ]
            })
        }

        //List the equipments in that category
        let code = 1
        categories.forEach(category => {
            if (ignoreCase.equals(args.join(' '), category)) {
                code = 0

                const weapons = getWeapons(equipmentJson, args.join(' '))
                const embed = new MessageEmbed()
                    .setAuthor(messageDetails.author, messageDetails.avatar)
                    .addFields([
                        { name: `❯ ${category} - List`, value: weapons },
                        { name: '❯ Usage', value: `${messageDetails.prefix}equipments <equipment>` }
                    ])
                    .setColor('BLUE')

                utils.sendMessage(message, interaction, {
                    embeds: [
                        embed
                    ]
                })
            }
        })

        //Show full details of the equipment
        if (code == 1) {
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
                        .setAuthor(messageDetails.author, messageDetails.avatar)
                        .addFields([
                            { name: '❯ Name', value: equipment.name },
                            { name: '❯ Requirements', value: equipment.requirements },
                            { name: '❯ Stats', value: stats },
                            { name: '❯ Monsters', value: monsters }
                        ])
                        .setColor('BLUE')

                    utils.sendMessage(message, interaction, {
                        embeds: [
                            embed
                        ]
                    })
                }
            })
        }

        //If the user typed didnt exist
        if (code == 1) {
            const embed = new MessageEmbed()
                .setAuthor(messageDetails.author, messageDetails.avatar)
                .setDescription('Make sure the equipment or the category you typed is valid')
                .addField('❯ Usage', `${messageDetails.prefix}equipments - To list all weapon categories in the game\n${messageDetails.prefix}equipments <category> - To list all the equipments in that category`)
                .setColor('RED')

            utils.sendMessage(message, interaction, {
                embeds: [
                    embed
                ]
            })
        }
    }
}
