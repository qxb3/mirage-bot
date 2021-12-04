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

module.exports = {
    category: 'Wiki',
    description: 'A command that will help you with enchantments in the game.',
    aliases: ['enchantment', 'enchants', 'enchant'],

    slash: 'both',

    expectedArgs: '<enchanment>',
    options: [
        {
            name: 'enchantment',
            description: 'The name of the enchantment you want to check',
            required: false,
            type: 3
        }
    ],

    callback: async ({ message, interaction, args, prefix }) => {
        const messageDetails = getMessageDetails(message, interaction, prefix)

        const enchantmentJson = JSON.parse(Buffer.from(fs.readFileSync(process.env.PWD + '/assets/wiki/enchantments.json').toString()))
        const categories = []
        enchantmentJson.forEach(enchantment => {
            categories.push(enchantment.name)
        })
        
        //List the enchantments
        if (!args[0]) {
            const list = getCategories(categories)
            const embed = new MessageEmbed()
                .setAuthor(messageDetails.author, messageDetails.avatar)
                .setThumbnail('attachment://physical.png')
                .addField('❯ Enchantments', list)
                .addField('❯ Usage', `${messageDetails.prefix}enchantments <enchantment>`)
                .setColor('BLUE')

            return sendMessage(message, interaction, {
                embeds: [
                    embed
                ],
                files: [
                    process.env.PWD + '/assets/wiki/sprites/enchantments/physical.png'
                ]
            })
        }

        //Show full details of a enchantment
        let code = 1
        enchantmentJson.forEach(enchantment => {
            if (ignoreCase.equals(args.join(' '), enchantment.name)) {
                code = 0

                const name = enchantment.name.replaceAll(' ', '-').toLowerCase()
                const sprite = process.env.PWD + '/assets/wiki/sprites/enchantments/' + name + '.png'

                let materialsRequired = ''
                enchantment.materials_required.forEach(material => {
                    materialsRequired += `• ${material}\n`
                })

                const embed = new MessageEmbed()
                    .setAuthor(messageDetails.author, messageDetails.avatar)
                    .setThumbnail(`attachment://${name}.png`)
                    .addFields([
                        { name: '❯ Enchantment', value: enchantment.name },
                        { name: '❯ Enchanter', value: enchantment.enchanter },
                        { name: '❯ Location', value: enchantment.location },
                        { name: '❯ Materials Required', value: materialsRequired }
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

        //If the enchantment user typed didn't exist
        if (code == 1) {
            const embed = new MessageEmbed()
                .setAuthor(messageDetails.author, messageDetails.avatar)
                .setThumbnail('attachment://physical.png')
                .setDescription('Make sure the enchantment you type is valid')
                .addField('❯ Usage', `${messageDetails.prefix}enchantments - To list all enchantments in the game` )
                .setColor('RED')

            sendMessage(message, interaction, {
                embeds: [
                    embed
                ],
                files: [
                    process.env.PWD + '/assets/wiki/sprites/enchantments/physical.png'
                ]
            })
        }
    }
}
