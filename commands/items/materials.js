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
    category: 'Items',
    description: 'A command that will help you with materials in the game.',
    aliases: ['material', 'mats'],

    slash: 'both',

    expectedArgs: '<material>',
    options: [
        {
            name: 'material',
            description: 'The name of the material you want to check.',
            required: 'false',
            type: 3
        }
    ],

    callback: async ({ message, interaction, args, prefix }) => {
        const messageDetails = getMessageDetails(message, interaction, prefix)

        const materialJson = JSON.parse(Buffer.from(fs.readFileSync(process.env.PWD + '/assets/items/materials.json').toString()))
        const categories = []
        materialJson.forEach(material => {
            categories.push(material.name)
        })

        //List the materials
        if (!args[0]) {
            const list = getCategories(categories)
            const embed = new MessageEmbed() 
                .setAuthor(messageDetails.author, messageDetails.avatar)
                .setThumbnail('attachment://troll-fur.png')
                .addField('❯ Materials', list)
                .addField('❯ Usage', `${messageDetails.prefix}materials <material>`)
                .setColor('BLUE')

            return sendMessage(message, interaction, {
                embeds: [
                    embed
                ],
                files: [
                    process.env.PWD + '/assets/items/sprites/materials/troll-fur.png'
                ]
            })
        }

        //Show full details of a material
        let code = 1
        materialJson.forEach(material => {
            if (ignoreCase.equals(args.join(' '), material.name)) {
                code = 0

                const name = material.name.replaceAll(' ', '-').toLowerCase()
                const sprite = process.env.PWD + '/assets/items/sprites/materials/' + name + '.png'

                let monsters = ''
                material.monsters.forEach(monster => {
                    monsters += `• ${monster}\n`
                })

                const embed = new MessageEmbed()
                    .setAuthor(messageDetails.author, messageDetails.avatar)
                    .setThumbnail(`attachment://${name}.png`)
                    .addFields([
                        { name: '❯ Name', value: material.name },
                        { name: '❯ Price', value: material.price },
                        { name: '❯ Drops from', value: monsters },
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

        //If the material user typed didn't exist
        if (code == 1) {
            const embed = new MessageEmbed()
                .setAuthor(messageDetails.author, messageDetails.avatar)
                .setThumbnail('attachment://troll-fur.png')
                .setDescription('Make sure the material you type is valid')
                .addField('❯ Usage', `${messageDetails.prefix}materials - To list all materials in the game` )
                .setColor('RED')

            sendMessage(message, interaction, {
                embeds: [
                    embed
                ],
                files: [
                    process.env.PWD + '/assets/items/sprites/materials/troll-fur.png'
                ]
            })
        }
    }
}
