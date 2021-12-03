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
    description: 'A command that will help you for potions in the game.',
    aliases: ['potion', 'pots'],

    slash: 'both',

    expectedArgs: '<potion>',
    options: [
        {
            name: 'potion',
            description: 'The name of the potion that you wanted to check.',
            required: false,
            type: 3
        }
    ],

    callback: async ({ message, interaction, args, prefix }) => {
        const messageDetails = getMessageDetails(message, interaction, prefix)

        const potionJson = JSON.parse(Buffer.from(fs.readFileSync(process.env.PWD + '/assets/items/potions.json').toString()))
        const categories = []
        potionJson.forEach(potion => {
            categories.push(potion.name)
        })

        //List the potions
        if (!args[0]) {
            const list = getCategories(categories)
            const embed = new MessageEmbed() 
                .setAuthor(messageDetails.author, messageDetails.avatar)
                .setThumbnail('attachment://health-vial.png')
                .addField('❯ Potions', list)
                .addField('❯ Usage', `${messageDetails.prefix}potions <potion>`)
                .setColor('BLUE')

            return sendMessage(message, interaction, {
                embeds: [
                    embed
                ],
                files: [
                    process.env.PWD + '/assets/items/sprites/potions/health-vial.png'
                ]
            })
        }

        //Show full details of a potion
        let code = 1
        potionJson.forEach(potion => {
            if (ignoreCase.equals(args.join(' '), potion.name)) {
                code = 0

                const name = potion.name.replaceAll(' ', '-').toLowerCase()
                const sprite =  process.env.PWD + '/assets/items/sprites/potions/' + name + '.png'

                let effects = ''
                potion.effects.forEach(effect => {
                    effects += `• ${effect}\n`
                })

                let monsters = ''
                potion.monsters.forEach(monster => {
                    monsters += `• ${monster}\n`
                })

                const embed = new MessageEmbed()
                    .setAuthor(messageDetails.author, messageDetails.avatar)
                    .setThumbnail(`attachment://${name}.png`)
                    .addFields([
                        { name: '❯ Name', value: potion.name },
                        { name: '❯ Effects', value: effects },
                        { name: '❯ Monsters', value: monsters },
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

        //If the potion user typed didn't exist
        if (code == 1) {
            const embed = new MessageEmbed()
                .setAuthor(messageDetails.author, messageDetails.avatar)
                .setThumbnail('attachment://health-vial.png')
                .setDescription('Make sure the potion you type is valid')
                .addField('❯ Usage', `${messageDetails.prefix}potion - To list all food in the game` )
                .setColor('RED')

            sendMessage(message, interaction, {
                embeds: [
                    embed
                ],
                files: [
                    process.env.PWD + '/assets/items/sprites/potions/health-vial.png'
                ]
            })
        }
    }
}
