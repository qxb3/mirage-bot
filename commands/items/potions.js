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
    description: 'A command that will help you for potions in the game.',

    slash: 'both',

    maxArgs: 1,
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
        const messageDetails = utils.getMessageDetails(message, interaction, prefix)

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
                .addField('❯ Potions', list)
                .addField('❯ Usage', `${messageDetails.prefix}potions <potion>`)
                .setColor('BLUE')

            return utils.sendMessage(message, interaction, {
                embeds: [
                    embed
                ]
            })
        }

        //Show full details of a potion
        let code = 1
        potionJson.forEach(potion => {
            if (ignoreCase.equals(args.join(' '), potion.name)) {
                code = 0

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
                    .addFields([
                        { name: '❯ Name', value: potion.name },
                        { name: '❯ Effects', value: effects },
                        { name: '❯ Monsters', value: monsters },
                    ])
                    .setColor('BLUE')

                utils.sendMessage(message, interaction, {
                    embeds: [
                        embed
                    ]
                })
            }
        })

        //If the potion user typed didn't exist
        if (code == 1) {
            const embed = new MessageEmbed()
                .setAuthor(messageDetails.author, messageDetails.avatar)
                .setDescription('Make sure the potion you type is valid')
                .addField('❯ Usage', `${messageDetails.prefix}potion - To list all food in the game` )
                .setColor('RED')

            utils.sendMessage(message, interaction, {
                embeds: [
                    embed
                ]
            })
        }
    }
}
