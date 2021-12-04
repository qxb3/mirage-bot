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

const getSkills = (skillJson, type) => {
    let skills = ''
    skillJson.filter(skill => ignoreCase.equals(type, skill.vocation))
        .forEach(skill => {
            skills += `• ${skill.name}\n`
    })
    return skills
}

module.exports = {
    category: 'Wiki',
    description: 'A command that will help you for skills in the game.',
    aliases: ['skill'],

    slash: 'both',

    expectedArgs: '<skill>',
    options: [
        {
            name: 'skill',
            description: 'The name of the skill you want to check.',
            required: false,
            type: 3
        }
    ],

    callback: async ({ message, interaction, args, prefix }) => {
        const messageDetails = getMessageDetails(message, interaction, prefix)

        const skillJson = JSON.parse(Buffer.from(fs.readFileSync(process.env.PWD + '/assets/wiki/skills.json').toString()))
        const categories = ['Knight', 'Ranger', 'Mage', 'Shaman']

        //List the categories
        if (!args[0]) {
            const list = getCategories(categories)
            const embed = new MessageEmbed() 
                .setAuthor(messageDetails.author, messageDetails.avatar)
                .setThumbnail('attachment://explosion.png')
                .addField('❯ Vocations', list)
                .addField('❯ Usage', `${messageDetails.prefix}skills <skill>`)
                .setColor('BLUE')

            return sendMessage(message, interaction, {
                embeds: [
                    embed
                ],
                files: [
                    process.env.PWD + '/assets/wiki/sprites/skills/mage/explosion.png'
                ]
            })
        }

        //List the skills in that category
        let code = 1
        categories.forEach(category => {
            if (ignoreCase.equals(args.join(' '), category)) {
                code = 0

                const skills = getSkills(skillJson, category)
                const embed = new MessageEmbed()
                    .setAuthor(messageDetails.author, messageDetails.avatar)
                    .setThumbnail(`attachment://${category.toLowerCase()}.png`)
                    .addField('❯ Skills', skills)
                    .setColor('BLUE')

                sendMessage(message, interaction, {
                    embeds: [
                        embed
                    ],
                    files: [
                        process.env.PWD + `/assets/wiki/sprites/skills/category-thumbnails/${category.toLowerCase()}.png`
                    ]
                })
            }
        })

        //Show full details of a skill
        if (code == 1) {
            skillJson.forEach(skill => {
                if (ignoreCase.equals(args.join(' '), skill.name)) {
                    code = 0

                    const name = skill.name.replaceAll(' ', '-').toLowerCase()
                    const sprite = process.env.PWD + '/assets/wiki/sprites/skills/' + skill.vocation.toLowerCase() + '/' + name + '.png'

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

        //If the vocation user typed didn't exist
        if (code == 1) {
            const embed = new MessageEmbed()
                .setAuthor(messageDetails.author, messageDetails.avatar)
                .setDescription('Make sure the skill you type is valid')
                .addField('❯ Usage', `${messageDetails.prefix}skills - To list all skill categories available in the game` )
                .setColor('RED')

            sendMessage(message, interaction, {
                embeds: [
                    embed
                ],
                /*files: [
                    process.env.PWD + '/assets/wiki/sprites/vocations/knight.png'
                ]*/
            })
        }
    }
}
