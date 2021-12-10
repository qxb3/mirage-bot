const materialsJson = require('@assets/items/materials.json')
const sendMessage = require('@utils/send-message')
const formatter = require('@utils/formatter')
const getEmbed = require('@utils/get-embed')

const didyoumean = require('didyoumean2').default

module.exports = {
    category: 'Items',
    description: 'A command that will help you with materials in the game.',
    aliases: ['material', 'mats', 'mt'],
    globalCooldown: '10s',

    slash: 'both',

    expectedArgs: '<material>',
    options: [
        {
            name: 'material',
            description: 'The name of the material you want to check.',
            required: 'false',
            type: 3
        }
    ],

    callback: async ({ message, interaction, args, prefix, user }) => {
        const embed = getEmbed(user)

        if (interaction) {
            prefix = '/'
        }

        const usage = {
            name: '❯ Usage',
            value: `${prefix}materials <material> - To see the full details of the material.\n` +
                   `${prefix}materials - To list all the materials.`
        }

        //If user didn't give arguments
        if (args.length === 0) {
            const materials = formatter(materialsJson.map(data => data.name))

            embed.setThumbnail('attachment://troll-fur.png')
            embed.addFields([
                { name: '❯ Materials', value: materials },
                usage
            ])

            sendMessage(message, interaction, {
                embeds: [ embed ],
                files: [ 'assets/items/sprites/materials/troll-fur.png' ]
            })
            return
        }

        const input = args.join(' ')
        const isMaterial = didyoumean(input, materialsJson.map(data => data.name), { threshold: 0.6 })

        //If the user input is material
        if (isMaterial) {
            const material = materialsJson.find(data => data.name === isMaterial)
            const sprite = material.name.replace(/'/, '').replaceAll(' ', '-').toLowerCase() + '.png'

            embed.setThumbnail(`attachment://${sprite}`)
            embed.addFields([
                { name: '❯ Name', value: material.name },
                { name: '❯ Price', value: material.price },
                { name: '❯ Monsters', value: formatter(material.monsters) },
            ])

            sendMessage(message, interaction, {
                embeds: [ embed ],
                files: [ `assets/items/sprites/materials/${sprite}` ]
            })
            return
        }

        //If didn't match anything
        embed.setThumbnail('attachment://troll-fur.png')
        embed.setDescription('The material you typed did not match to any materials.')
        embed.addFields([ usage ])
        embed.setColor('RED')

        sendMessage(message, interaction, {
            embeds: [ embed ],
            files: [ 'assets/items/sprites/materials/troll-fur.png' ]
        })
    }
}
