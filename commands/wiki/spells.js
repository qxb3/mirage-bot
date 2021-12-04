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

const getSpells = (spellJson, type) => {
    let skills = ''
    spellJson.filter(skill => ignoreCase.equals(type, skill.vocation))
        .forEach(skill => {
            skills += `• ${skill.name}\n`
    })
    return skills
}

module.exports = {
    category: 'Wiki',
    description: 'A command that will help you for spells in the game.',
    aliases: ['spell'],

    slash: 'both',

    expectedArgs: '<spell>',
    options: [
        {
            name: 'spell',
            description: 'The name of the spell you want to check.',
            required: false,
            type: 3
        }
    ],

    callback: async ({ message, interaction, args, prefix }) => {
        const messageDetails = getMessageDetails(message, interaction, prefix)

        const spellJson = JSON.parse(Buffer.from(fs.readFileSync(process.env.PWD + '/assets/wiki/spells.json').toString()))
        const categories = ['Knight', 'Ranger', 'Mage', 'Shaman']

        //List the categories
        if (!args[0]) {
            const list = getCategories(categories)
            const embed = new MessageEmbed() 
                .setAuthor(messageDetails.author, messageDetails.avatar)
                .setThumbnail('attachment://explosion.png')
                .addField('❯ Vocations', list)
                .addField('❯ Usage', `${messageDetails.prefix}spells <spell>`)
                .setColor('BLUE')

            return sendMessage(message, interaction, {
                embeds: [
                    embed
                ],
                files: [
                    process.env.PWD + '/assets/wiki/sprites/spells/mage/explosion.png'
                ]
            })
        }

        //List the spells in that category
        let code = 1
        categories.forEach(category => {
            if (ignoreCase.equals(args.join(' '), category)) {
                code = 0

                const skills = getSpells(spellJson, category)
                const embed = new MessageEmbed()
                    .setAuthor(messageDetails.author, messageDetails.avatar)
                    .setThumbnail(`attachment://${category.toLowerCase()}.png`)
                    .addField(`❯ ${category} Spells`, skills)
                    .addField('❯ Usage', `${messageDetails.prefix}spells <spell>`)
                    .setColor('BLUE')

                sendMessage(message, interaction, {
                    embeds: [
                        embed
                    ],
                    files: [
                        process.env.PWD + `/assets/wiki/sprites/spells/category-thumbnails/${category.toLowerCase()}.png`
                    ]
                })
            }
        })

        //Show full details of a spell
        if (code == 1) {
            spellJson.forEach(skill => {
                if (ignoreCase.equals(args.join(' '), skill.name)) {
                    code = 0

                    const name = skill.name.replaceAll(' ', '-').toLowerCase()
                    const sprite = process.env.PWD + '/assets/wiki/sprites/spells/' + skill.vocation.toLowerCase() + '/' + name + '.png'

                    let effects = ''
                    skill.effects.forEach(effect => {
                        effects += `${effect}\n`
                    })

                    const embed = new MessageEmbed()
                        .setAuthor(messageDetails.author, messageDetails.avatar)
                        .setThumbnail(`attachment://${name}.png`)
                        .addFields([
                            { name: '❯ Name', value: `${skill.name}` },
                            { name: '❯ Description', value: `${skill.description}` },
                            { name: '❯ Level requirement', value: `${skill.requirement}` },
                            { name: '❯ Cooldown', value: `${skill.cooldown}` },
                            { name: '❯ Effects', value: effects }
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
        }

        //If the spell user typed didn't exist
        if (code == 1) {
            const embed = new MessageEmbed()
                .setAuthor(messageDetails.author, messageDetails.avatar)
                .setThumbnail('attachment://explosion.png')
                .setDescription('Make sure the spell you type is valid')
                .addField('❯ Usage', `${messageDetails.prefix}spells - To list all spell categories available in the game` )
                .setColor('RED')

            sendMessage(message, interaction, {
                embeds: [
                    embed
                ],
                files: [
                    process.env.PWD + '/assets/wiki/sprites/spells/mage/explosion.png'
                ]
            })
        }
    }
}
