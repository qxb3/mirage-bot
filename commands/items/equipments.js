const { MessageEmbed } = require('discord.js')

const equipmentsJson = require('@assets/items/equipments.json')
const sendMessage = require('@utils/send-message')
const formatter = require('@utils/formatter')
const getEmbed = require('@utils/get-embed')

const didyoumean = require('didyoumean2').default

module.exports = {
    category: 'Items',
    description: 'A command that will help you for equipments in the game',
    aliases: ['equipment', 'equips', 'equip', 'eq'],

    slash: 'both',

    expectedArgs: '<equipment>',
    options: [
        {
            name: 'equipment',
            description: 'It can be the name of the equipment or a category.',
            required: false,
            type: 3
        }
    ],

    callback: async ({ message, interaction, args, prefix, user }) => {
        const categories = ['Helmet', 'Chest', 'Gloves', 'Boots', 'Ring', 'Necklace']
        const embed = getEmbed(user)

        if (interaction) {
            prefix = '/'
        }

        const usage = {
            name: '❯ Usage',
            value: `${prefix}equipments <equipment> - To see the full details of an item.\n` +
                   `${prefix}equipments <category> - To see all the items in that categories.\n` +
                   `${prefix}equipments - To sell all the categories.`
        }

        //If user didn't give arguments
        if (args.length === 0) {
            embed.setThumbnail('attachment://chest.png')
            embed.addFields([
                { name: '❯ Categories', value: formatter(categories) },
                usage
            ])

            sendMessage(message, interaction, {
                embeds: [ embed ],
                files: [ 'assets/items/sprites/equipments/thumbnails/chest.png' ]
            })
            return
        }

        const input = args.join(' ')
        const isCategory = didyoumean(input, categories, { threshold: 0.6 })
        const isEquipment = didyoumean(input, equipmentsJson.map(data => data.name), { threshold: 0.6 })

        //If the user input is category
        if (isCategory) {
            const equipments = formatter(equipmentsJson.filter(data => data.type === isCategory).map(data => data.name))
            const sprite = `${isCategory.toLowerCase()}.png`

            embed.setThumbnail(`attachment://${sprite}`)
            embed.addFields([
                { name: `❯ ${isCategory}`, value: equipments },
                usage
            ])

            sendMessage(message, interaction, {
                embeds: [ embed ],
                files: [ `assets/items/sprites/equipments/thumbnails/${sprite}` ]
            })
            return
        }

        //If the user input is equipment
        if (isEquipment) {
            const equipment = equipmentsJson.find(data => data.name === isEquipment)
            const sprite = equipment.name.replace(/'/, '').replaceAll(' ', '-').toLowerCase() + '.png'
            const type = equipment.type.toLowerCase()

            embed.setThumbnail(`attachment://${sprite}`)
            embed.addFields(
                { name: '❯ Name', value: equipment.name },
                { name: '❯ Requirement', value: equipment.requirements },
                { name: '❯ Stats', value: formatter(equipment.stats) },
                { name: '❯ Monsters', value: formatter(equipment.monsters) }
            )
            sendMessage(message, interaction, {
                embeds: [ embed ],
                files: [ `assets/items/sprites/equipments/${type + '/' + sprite}` ]
            })
            return
        }

        //If didn't match anything
        embed.setThumbnail('attachment://chest.png')
        embed.setDescription('The equipment you typed did not match to any equipments.')
        embed.addFields([ usage ])
        embed.setColor('RED')

        sendMessage(message, interaction, {
            embeds: [ embed ],
            files: [ 'assets/items/sprites/equipments/thumbnails/chest.png' ]
        })
    }
}
