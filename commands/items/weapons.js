const { MessageEmbed, MessageAttachment } = require('discord.js')
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
    description: 'A command that will help you for weapons in the game',
    aliases: ['weapon', 'weaps', 'weap'],

    slash: 'both',
    testOnly: true,

    expectedArgs: '<weapon>',
    options: [
        {
            name: 'weapon',
            description: 'It can be the name of the weapon or a category.',
            required: false,
            type: 3
        }
    ],

    callback: async ({ message, interaction, args, prefix }) => {
        const messageDetails = utils.getMessageDetails(message, interaction, prefix)

        const weaponJson = JSON.parse(Buffer.from(fs.readFileSync(process.env.PWD + '/assets/items/weapons.json').toString()))
        const categories = ['Sword', 'Axe', 'Mace', 'Shield', 'Bow', 'Ammunition', 'Staff', 'Rod', 'Spellbook']

        if (!args[0]) {
            const list = getCategories(categories)
            const embed = new MessageEmbed()
                .setAuthor(messageDetails.author, messageDetails.avatar)
                .setThumbnail('attachment://sword.png')
                .addField('❯ Categories', list)
                .addField('❯ Usage', `${messageDetails.prefix}weapons - To list all weapon categories in the game\n${messageDetails.prefix}weapons <category> - To list all the weapons in that category`)
                .setColor('BLUE')

            return utils.sendMessage(message, interaction, {
                embeds: [
                    embed
                ],
                files: [
                    process.env.PWD + '/assets/items/sprites/weapons/category-thumbnails/sword.png'
                ]
            })
        }

        //List the weapons in that category
        let code = 1
        categories.forEach(category => {
            if (ignoreCase.equals(args.join(' '), category)) {
                code = 0

                const weapons = getWeapons(weaponJson, args.join(' '))
                const embed = new MessageEmbed()
                    .setAuthor(messageDetails.author, messageDetails.avatar)
                    .setThumbnail(`attachment://${category.toLowerCase()}.png`)
                    .addFields([
                        { name: `❯ ${category}s`, value: weapons },
                        { name: '❯ Usage', value: `${messageDetails.prefix}weapons <weapon>` }
                    ])
                    .setColor('BLUE')

                utils.sendMessage(message, interaction, {
                    embeds: [
                        embed
                    ],
                    files: [
                        process.env.PWD + `/assets/items/sprites/weapons/category-thumbnails/${category.toLowerCase()}.png`
                    ]
                })
            }
        })

        //Show full details of the weapon
        if (code == 1) {
            weaponJson.forEach(weapon => {
                if (ignoreCase.equals(args.join(' '), weapon.name)) {
                    code = 0

                    const name = weapon.name.replace("'", '').replaceAll(' ', '-').toLowerCase()
                    const sprite = process.env.PWD + '/assets/items/sprites/weapons/' + weapon.type.toLowerCase() + '/' + weapon.name.replace("'", '').replaceAll(' ', '-').toLowerCase() + '.png'
                    
                    let stats = ''
                    weapon.stats.forEach(stat => {
                        stats += `• ${stat}\n`
                    })

                    let monsters = ''
                    weapon.monsters.forEach(monster => {
                        monsters += `• ${monster}\n`
                    })

                    const embed = new MessageEmbed()
                        .setAuthor(messageDetails.author, messageDetails.avatar)
                        .setThumbnail(`attachment://${name}.png`)
                        .addFields([
                            { name: '❯ Name', value: weapon.name },
                            { name: '❯ Requirements', value: weapon.requirements },
                            { name: '❯ Stats', value: stats },
                            { name: '❯ Monsters', value: monsters }
                        ])
                        .setColor('BLUE')

                    utils.sendMessage(message, interaction, {
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
                .setThumbnail('attachment://sword.png')
                .setDescription('Make sure the weapon or the category you typed is valid')
                .addField('❯ Usage', `${messageDetails.prefix}weapons - To list all weapon categories in the game\n${messageDetails.prefix}weapons <category> - To list all the weapons in that category`)
                .setColor('RED')

            utils.sendMessage(message, interaction, {
                embeds: [
                    embed
                ],
                files: [
                    process.env.PWD + '/assets/items/sprites/weapons/category-thumbnails/sword.png'
                ]
            })
        }
    }
}
