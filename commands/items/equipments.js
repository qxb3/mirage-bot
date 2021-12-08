const { MessageEmbed } = require('discord.js')

const equipmentJson = require('../../assets/items/equipments.json')
const sendMessage = require('../../utils/send-message')
const formatter = require('../../utils/formatter')

const didyoumean = require('didyoumean2').default

module.exports = {
    category: 'Items',
    description: 'A command that will help you for equipments in the game',
    aliases: ['equipment', 'equips', 'equip', 'eqs', 'eq'],

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
        const embed = new MessageEmbed()
            .setAuthor(user.tag, user.displayAvatarURL())
            .setColor('GREEN')

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
            embed.setThumbnail('attachment://cloth-shirt.png')
            embed.addFields([
                { name: '❯ Categories', value: formatter(categories) },
                usage
            ])

            sendMessage(message, interaction, {
                embeds: [ embed ],
                files: [  process.env.PWD + '/assets/items/sprites/equipments/chest/cloth-shirt.png' ]
            })
            return
        }

        const isCategory = didyoumean(args.join(' '), categories)
        const isEquipment = didyoumean(args.join(' '), equipmentJson.map(data => data.name))

        //If the user input is category
        if (isCategory) {
            const equipments = formatter(equipmentJson.filter(data => data.type === isCategory).map(data => data.name))
            const sprite = `${isCategory.toLowerCase()}.png`

            embed.setThumbnail(`attachment://${sprite}`)
            embed.addFields([
                { name: `❯ ${isCategory}`, value: equipments },
                usage
            ])

            sendMessage(message, interaction, {
                embeds: [ embed ],
                files: [ `${process.env.PWD}/assets/items/sprites/equipments/category-thumbnails/${sprite}` ]
            })
            return
        }

        //If the user input is equipment
        if (isEquipment) {
            const equipment = equipmentJson.find(data => data.name === isEquipment)
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
                files: [ `${process.env.PWD}/assets/items/sprites/equipments/${type}/${sprite}` ]
            })
            return
        }

        //If didn't match anything
        embed.setThumbnail('attachment://error.png')
        embed.setDescription('The equipment you typed did not match to any equipments.')
        embed.addFields([ usage ])
        embed.setColor('RED')

        sendMessage(message, interaction, {
            embeds: [ embed ],
            files: [ `${process.env.PWD}/assets/icons/error.png` ]
        })
    }
}
