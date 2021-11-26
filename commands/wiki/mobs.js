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
    category: 'Mobs',
    description: 'A command will help you with mobs in the game.',

    slash: 'both',
    testOnly: true,

    maxArgs: 1,
    expectedArgs: '<mob>',
    options: [
        {
            name: 'mob',
            description: 'The mob name you want to check.',
            type: 3
        }
    ],

    callback: async ({ message, interaction, args, prefix }) => {
        const messageDetails = utils.getMessageDetails(message, interaction, prefix)

        const mobsJson = JSON.parse(Buffer.from(fs.readFileSync(process.env.PWD + '/assets/mobs/mobs.json').toString()))
        const categories = []
        mobsJson.forEach(mob => {
            categories.push(mob.name)
        }) 

        //List the mobs
        if (!args[0]) {
            const list = getCategories(categories)
            const embed = new MessageEmbed() 
                .setAuthor(messageDetails.author, messageDetails.avatar)
                .addField('❯ Mobs', list)
                .addField('❯ Usage', `${messageDetails.prefix}mobs <mob>`)
                .setColor('BLUE')

            return utils.sendMessage(message, interaction, {
                embeds: [
                    embed
                ]
            })
        }

        //Show full details of a mob
        let code = 1
        mobsJson.forEach(mob => {
            if (ignoreCase.equals(args.join(' '), mob.name)) {
                code = 0

                let stats = ''
                mob.stats.forEach(stat => {
                    stats += `• ${stat}\n`
                })

                let resistance = ''
                mob.resistance.forEach(res => {
                    resistance += `• ${res}\n`
                })

                let loots = ''
                mob.loots.forEach(loot => {
                    loots += `• ${loot}\n`
                })

                const embed = new MessageEmbed()
                    .setAuthor(messageDetails.author, messageDetails.avatar)
                    .addFields([
                        { name: '❯ Name', value: mob.name },
                        { name: '❯ Stats', value: stats },
                        { name: '❯ Resistance', value: resistance },
                        { name: `❯ Loots`, value: loots }
                    ])
                    .setColor('BLUE')

                utils.sendMessage(message, interaction, {
                    embeds: [
                        embed
                    ]
                })
            }
        })

        //If the mob user typed didn't exist
        if (code == 1) {
            const embed = new MessageEmbed()
                .setAuthor(messageDetails.author, messageDetails.avatar)
                .setDescription('Make sure the mob you type is valid')
                .addField('❯ Usage', `${messageDetails.prefix}mobs - To list all mobs in the game` )
                .setColor('RED')

            utils.sendMessage(message, interaction, {
                embeds: [
                    embed
                ]
            })
        }
    }
}
