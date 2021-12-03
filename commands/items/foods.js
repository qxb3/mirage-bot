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
    description: 'A command that will help you for the foods in the game.',
    aliases: ['food'],

    slash: 'both',

    expectedArgs: '<food>',
    options: [
        {
            name: 'food',
            description: 'The name of the food that you want to check.',
            required: false,
            type: 3
        }
    ],

    callback: async ({ message, interaction, args, prefix }) => {
        const messageDetails = getMessageDetails(message, interaction, prefix)

        const foodJson = JSON.parse(Buffer.from(fs.readFileSync(process.env.PWD + '/assets/items/foods.json').toString()))
        const categories = []
        foodJson.forEach(material => {
            categories.push(material.name)
        }) 

        //List the foods
        if (!args[0]) {
            const list = getCategories(categories)
            const embed = new MessageEmbed() 
                .setAuthor(messageDetails.author, messageDetails.avatar)
                .setThumbnail('attachment://meat.png')
                .addField('❯ Foods', list)
                .addField('❯ Usage', `${messageDetails.prefix}foods <food>`)
                .setColor('BLUE')

            return sendMessage(message, interaction, {
                embeds: [
                    embed
                ],
                files: [
                    process.env.PWD + '/assets/items/sprites/foods/meat.png'
                ]
            })
        }

        //Show full details of a food
        let code = 1
        foodJson.forEach(food => {
            if (ignoreCase.equals(args.join(' '), food.name)) {
                code = 0

                const name = food.name.replaceAll(' ', '-').toLowerCase()
                const sprite = process.env.PWD + '/assets/items/sprites/foods/' + name + '.png'
                
                let monsters = ''
                food.monsters.forEach(monster => {
                    monsters += `• ${monster}\n`
                })

                const embed = new MessageEmbed()
                    .setAuthor(messageDetails.author, messageDetails.avatar)
                    .setThumbnail(`attachment://${name}.png`)
                    .addFields([
                        { name: '❯ Name', value: food.name },
                        { name: '❯ Effect', value: food.effect },
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

        //If the food user typed didn't exist
        if (code == 1) {
            const embed = new MessageEmbed()
                .setAuthor(messageDetails.author, messageDetails.avatar)
                .setThumbnail('attachment://meat.png')
                .setDescription('Make sure the food you type is valid')
                .addField('❯ Usage', `${messageDetails.prefix}foods - To list all food in the game` )
                .setColor('RED')

            sendMessage(message, interaction, {
                embeds: [
                    embed
                ],
                files: [
                    process.env.PWD + '/assets/items/sprites/foods/meat.png'
                ]
            })
        }
    }
}
