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

module.exports = {
    category: 'Items',
    description: 'A command that will help you for scrolls in the game.',
    aliases: ['scroll'],

    slash: 'both',

    expectedArg: '<scroll>',
    options: [
        {
            name: 'scroll',
            description: 'The name of the scroll that you want to check.',
            required: false,
            type: 3
        }
    ],

    callback: async ({ message, interaction, args, prefix }) => {
        const messageDetails = utils.getMessageDetails(message, interaction, prefix)

        const scrollJson = JSON.parse(Buffer.from(fs.readFileSync(process.env.PWD + '/assets/items/scrolls.json').toString()))
        const categories = []
        scrollJson.forEach(scroll => {
            categories.push(scroll.name)
        })

        //List the scrolls
        if (!args[0]) {
            const list = getCategories(categories)
            const embed = new MessageEmbed() 
                .setAuthor(messageDetails.author, messageDetails.avatar)
                .setThumbnail('attachment://experience-scroll.png')
                .addField('❯ Materials', list)
                .addField('❯ Usage', `${messageDetails.prefix}scrolls <scrolls>`)
                .setColor('BLUE')

            return utils.sendMessage(message, interaction, {
                embeds: [
                    embed
                ],
                files: [
                    process.env.PWD + '/assets/items/sprites/scrolls/experience-scroll.png'
                ]
            })
        }

        //Show full details of a scroll
        let code = 1
        scrollJson.forEach(scroll => {
            if (ignoreCase.equals(args.join(' '), scroll.name)) {
                code = 0

                const name = scroll.name.replaceAll(' ', '-').toLowerCase()
                const sprite = process.env.PWD + '/assets/items/sprites/scrolls/' + name + '.png'

                let effects = ''
                scroll.effects.forEach(effect => {
                    effects += `• ${effect}\n`
                })

                const embed = new MessageEmbed()
                    .setAuthor(messageDetails.author, messageDetails.avatar)
                    .setThumbnail(`attachment://${name}.png`)
                    .addFields([
                        { name: '❯ Name', value: scroll.name },
                        { name: '❯ Effects', value: effects }
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

        //If the scroll user typed didn't exist
        if (code == 1) {
            const embed = new MessageEmbed()
                .setAuthor(messageDetails.author, messageDetails.avatar)
                .setThumbnail('attachment://experience-scroll.png')
                .setDescription('Make sure the scroll you type is valid')
                .addField('❯ Usage', `${messageDetails.prefix}scrolls - To list all scrolls in the game` )
                .setColor('RED')

            utils.sendMessage(message, interaction, {
                embeds: [
                    embed
                ],
                files: [
                    process.env.PWD + '/assets/items/sprites/scrolls/experience-scroll.png'
                ]
            })
        }
    }
}
