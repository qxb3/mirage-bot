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
    description: 'A command that will help you with slangs in the game.',
    aliases: ['slangs'],

    slash: 'both',

    expectedArgs: '<slang>',
    options: [
        {
            name: 'slang',
            description: 'The name of the slang you want to check.',
            required: false,
            type: 3
        }
    ],

    callback: async ({ message, interaction, args, prefix }) => {
        const messageDetails = getMessageDetails(message, interaction, prefix)

        const slangJson = JSON.parse(Buffer.from(fs.readFileSync(process.env.PWD + '/assets/wiki/slangs.json').toString()))
        const categories = []
        slangJson.forEach(slang => {
            categories.push(slang.slang)
        }) 

        //List the slang
        if (!args[0]) {
            const list = getCategories(categories)
            const embed = new MessageEmbed()
                .setAuthor(messageDetails.author, messageDetails.avatar)
                .setThumbnail('attachment://rules.png')
                .addField('❯ Slangs', list)
                .addField('❯ Usage', `${messageDetails.prefix}slang <slang>`)
                .setColor('BLUE')

            return sendMessage(message, interaction, {
                embeds: [
                    embed
                ],
                files: [
                    process.env.PWD + '/assets/icons/rules.png'
                ]
            })
        }

        //Show full details of a slang
        let code = 1
        slangJson.forEach(slang => {
            if (ignoreCase.equals(args.join(' '), slang.slang)) {
                code = 0

                const embed = new MessageEmbed()
                    .setAuthor(messageDetails.author, messageDetails.avatar)
                    .setThumbnail('attachment://rules.png')
                    .addFields([
                        { name: '❯ Name', value: slang.name },
                        { name: '❯ Description', value: slang.description }
                    ])
                    .setColor('BLUE')

                sendMessage(message, interaction, {
                    embeds: [
                        embed
                    ],
                    files: [
                        process.env.PWD + '/assets/icons/rules.png'
                    ]
                })
            }
        })

        //If the slang user typed didn't exist
        if (code == 1) {
            const embed = new MessageEmbed()
                .setAuthor(messageDetails.author, messageDetails.avatar)
                .setThumbnail('attachment://rules.png')
                .setDescription('Make sure the slang you type is valid')
                .addField('❯ Usage', `${messageDetails.prefix}slang - To list all slangs commonly used in the game`)
                .setColor('RED')

            sendMessage(message, interaction, {
                embeds: [
                    embed
                ],
                files: [
                    process.env.PWD + '/assets/icons/rules.png'
                ]
            })
        }
    }
}
