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
    description: 'A command that will helps you identify vocations in the game.',
    aliases: ['vocation', 'vocs', 'voc'],

    slash: 'both',

    expectedArgs: '<vocation>',
    options: [
        {
            name: 'vocation',
            description: 'The name of the vocation you want to check.',
            required: false,
            type: 3
        }
    ],

    callback: async ({ message, interaction, args, prefix }) => {
        const messageDetails = getMessageDetails(message, interaction, prefix)

        const vocationJson = JSON.parse(Buffer.from(fs.readFileSync(process.env.PWD + '/assets/wiki/vocations.json').toString()))
        const categories = []
        vocationJson.forEach(vocation => {
            categories.push(vocation.name)
        })

        //List the vocations
        if (!args[0]) {
            const list = getCategories(categories)
            const embed = new MessageEmbed() 
                .setAuthor(messageDetails.author, messageDetails.avatar)
                .setThumbnail('attachment://knight.png')
                .addField('❯ Vocations', list)
                .addField('❯ Usage', `${messageDetails.prefix}vocations <vocation>`)
                .setColor('BLUE')

            return sendMessage(message, interaction, {
                embeds: [
                    embed
                ],
                files: [
                    process.env.PWD + '/assets/wiki/sprites/vocations/knight.png'
                ]
            })
        }

        //Show full details of a vocation
        let code = 1
        vocationJson.forEach(vocation => {
            if (ignoreCase.equals(args.join(' '), vocation.name)) {
                code = 0

                const name = vocation.name.replaceAll(' ', '-').toLowerCase()
                const sprite = process.env.PWD + '/assets/wiki/sprites/vocations/' + name + '.png'

                let weapons = ''
                vocation.weapons.forEach(weapon => {
                    weapons += `• ${weapon}\n`
                })

                let initialResistance = ''
                vocation.initial_resistance.forEach(resistance => {
                    initialResistance += `• ${resistance}\n`
                })

                const embed = new MessageEmbed()
                    .setAuthor(messageDetails.author, messageDetails.avatar)
                    .setThumbnail(`attachment://${name}.png`)
                    .addFields([
                        { name: '❯ Name', value: vocation.name },
                        { name: '❯ Weapons', value: weapons },
                        { name: '❯ Description', value: vocation.description },
                        { name: '❯ Initial Resistance', value: initialResistance }
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

        //If the vocation user typed didn't exist
        if (code == 1) {
            const embed = new MessageEmbed()
                .setAuthor(messageDetails.author, messageDetails.avatar)
                .setDescription('Make sure the vocation you type is valid')
                .addField('❯ Usage', `${messageDetails.prefix}vocations - To list all vocations available in the game` )
                .setColor('RED')

            sendMessage(message, interaction, {
                embeds: [
                    embed
                ],
                files: [
                    process.env.PWD + '/assets/wiki/sprites/vocations/knight.png'
                ]

            })
        }
    }
}
