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
    category: 'Wiki',
    description: 'A command that will help you with enchantments in the game.',
    aliases: ['enchantment', 'enchants', 'enchant'],

    slash: 'both',

    maxArgs: 1,
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
        const messageDetails = utils.getMessageDetails(message, interaction, prefix)

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
                .addField('❯ Enchantments', list)
                .addField('❯ Usage', `${messageDetails.prefix}enchantments <enchantment>`)
                .setColor('BLUE')

            return utils.sendMessage(message, interaction, {
                embeds: [
                    embed
                ]
            })
        }

        //Show full details of a enchantment
        let code = 1
        enchantmentJson.forEach(enchantment => {
            if (ignoreCase.equals(args.join(' '), enchantment.name)) {
                code = 0

                let materialsRequired = ''
                enchantment.materials_required.forEach(material => {
                    materialsRequired += `• ${material}\n`
                })

                const embed = new MessageEmbed()
                    .setAuthor(messageDetails.author, messageDetails.avatar)
                    .addFields([
                        { name: '❯ Enchantment', value: enchantment.name },
                        { name: '❯ Enchanter', value: enchantment.enchanter },
                        { name: '❯ Location', value: enchantment.location },
                        { name: '❯ Materials Required', value: materialsRequired }
                    ])
                    .setColor('BLUE')

                utils.sendMessage(message, interaction, {
                    embeds: [
                        embed
                    ]
                })
            }
        })

        //If the enchantment user typed didn't exist
        if (code == 1) {
            const embed = new MessageEmbed()
                .setAuthor(messageDetails.author, messageDetails.avatar)
                .setDescription('Make sure the enchantment you type is valid')
                .addField('❯ Usage', `${messageDetails.prefix}enchantments - To list all enchantments in the game` )
                .setColor('RED')

            utils.sendMessage(message, interaction, {
                embeds: [
                    embed
                ]
            })
        }
    }
}
