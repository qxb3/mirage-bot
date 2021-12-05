const { MessageEmbed } = require('discord.js')
const ignoreCase = require('ignore-case')
const fs = require('fs')
const getMessageDetails = require('../../utils/get-message-details')
const sendMessage = require('../../utils/send-message')

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
        const messageDetails = getMessageDetails(message, interaction, prefix)

        const equipmentJson = JSON.parse(Buffer.from(fs.readFileSync(process.env.PWD + '/assets/items/equipments.json').toString()))
        const categories = ['Helmet', 'Chest', 'Gloves', 'Boots', 'Ring', 'Necklace']

        if (!args[0]) {
            const list = getCategories(categories)
            const embed = new MessageEmbed()
                .setAuthor(messageDetails.author, messageDetails.avatar)
                .setThumbnail('attachment://cloth-shirt.png')
                .addField('❯ Categories', list)
                .addField('❯ Usage', `${messageDetails.prefix}equipments - To list all equipment categories in the game\n${messageDetails.prefix}equipments <category> - To list all the equipments in that category`)
                .setColor('BLUE')

            return sendMessage(message, interaction, {
                embeds: [
                    embed
                ],
                files: [
                    process.env.PWD + '/assets/items/sprites/equipments/chest/cloth-shirt.png'
                ]
            })
        }

        //List the equipments in that category
        let code = 1
        categories.forEach(category => {
            if (ignoreCase.equals(args.join(' '), category)) {
                code = 0

                const name = category.toLowerCase()
                const sprite = process.env.PWD + '/assets/items/sprites/equipments/category-thumbnails/' + name + '.png'

                const weapons = getWeapons(equipmentJson, args.join(' '))
                const embed = new MessageEmbed()
                    .setAuthor(messageDetails.author, messageDetails.avatar)
                    .setThumbnail(`attachment://${name}.png`)
                    .addFields([
                        { name: `❯ ${category} - List`, value: weapons },
                        { name: '❯ Usage', value: `${messageDetails.prefix}equipments <equipment>` }
                    ])
                    .setColor('BLUE')

                sendMessage(message, interaction, {
                    embeds: [
                        embed
                    ],
                    files: [
                        sprite
                    ]
                })
            }
        })

        //Show full details of the equipment
        if (code == 1) {
            equipmentJson.forEach(equipment => {
                if (ignoreCase.equals(args.join(' '), equipment.name)) {
                    code = 0

                    const name = equipment.name.replace("'", '').replaceAll(' ', '-').toLowerCase()
                    const sprite = process.env.PWD + '/assets/items/sprites/equipments/' + equipment.type.toLowerCase() + '/' + name + '.png'

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
                        .setThumbnail(`attachment://${name}.png`)
                        .addFields([
                            { name: '❯ Name', value: equipment.name },
                            { name: '❯ Requirements', value: equipment.requirements },
                            { name: '❯ Stats', value: stats },
                            { name: '❯ Monsters', value: monsters }
                        ])
                        .setColor('BLUE')

                    sendMessage(message, interaction, {
                        embeds: [
                            embed
                        ],
                        files: [
                            sprite
                        ]
                    })
                }
            })
        }

        //If the user typed didnt exist
        if (code == 1) {
            const embed = new MessageEmbed()
                .setAuthor(messageDetails.author, messageDetails.avatar)
                .setThumbnail('attachment://cloth-shirt.png')
                .setDescription('Make sure the equipment or the category you typed is valid')
                .addField('❯ Usage', `${messageDetails.prefix}equipments - To list all weapon categories in the game\n${messageDetails.prefix}equipments <category> - To list all the equipments in that category`)
                .setColor('RED')

            sendMessage(message, interaction, {
                embeds: [
                    embed
                ],
                files: [
                    process.env.PWD + '/assets/items/sprites/equipments/chest/cloth-shirt.png'
                ]
            })
        }
    }
}
