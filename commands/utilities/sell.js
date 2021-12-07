const { MessageEmbed } = require('discord.js')

const fs = require('fs')
const ignoreCase = require('ignore-case')

const getJsonFile = require('../../utils/get-json-file')
const sendMessage = require('../../utils/send-message')

module.exports = {
    category: 'Utilities',
    description: 'Sell items using beautiful embeds.',

    slash: 'both',

    minArgs: 3,
    expectedArgs: '<name> <stats> <price>',
    options: [
        {
            name: 'name',
            description: 'The name of the item you wanted to sell.',
            required: true,
            type: 3
        },
        {
            name: 'stats',
            description: 'The stats of the item. Example: 18 Melee',
            required: true,
            type: 3
        },
        {
            name: 'price',
            description: 'The price of the item.',
            required: true,
            type: 3
        }
    ],

    callback: async ({ message, interaction, user, args }) => {
        const price = args.pop()
        const stats = args.pop()
        const name = args.join(' ')

        const weaponsJson = getJsonFile('assets/items/weapons.json')
        const equipmentsJson = getJsonFile('assets/items/equipments.json')
        const materialsJson = getJsonFile('assets/items/materials.json')

        const embed = new MessageEmbed()
            .setAuthor(`${user.tag} is selling`, user.displayAvatarURL())
            .setColor('BLUE')
        let sprite = process.env.PWD + '/assets/icons/error.png'

        let error = true
        weaponsJson.forEach((weapon) => {
            const itemName = name.replaceAll(' ', '')
            const weaponSprite = weapon.name.replace(/'/, '').replace(' ', '-').toLowerCase() + '.png'
            const weaponName = weapon.name.replace(' ', '')
            const weaponType = weapon.type.toLowerCase()

            if (ignoreCase.equals(itemName, weaponName)) {
                error = false

                sprite = process.env.PWD + '/assets/items/sprites/weapons/' + weaponType + '/' + weaponSprite
                embed.setThumbnail(`attachment://${weaponSprite}`)
                embed.addFields([
                    { name: '❯ Item name', value: name },
                    { name: '❯ Stats', value: stats },
                    { name: '❯ Price', value: price }
                ])
            }
        })

        if (error) {
            equipmentsJson.forEach((equipment) => {
                const itemName = name.replaceAll(' ', '')
                const equipmentSprite = equipment.name.replace(/'/, '').replaceAll(' ', '-').toLowerCase() + '.png'
                const equipmentName = equipment.name.replace(' ', '')
                const equipmentType = equipment.type.toLowerCase()

                if (ignoreCase.equals(itemName, equipmentName)) {
                    error = false

                    sprite = process.env.PWD + '/assets/items/sprites/equipments/' + equipmentType + '/' + equipmentSprite
                    embed.setThumbnail(`attachment://${equipmentSprite}`)
                    embed.addFields([
                        { name: '❯ Item name', value: equipment.name },
                        { name: '❯ Stats', value: stats },
                        { name: '❯ Price', value: price }
                    ])
                }
            })
        } 

        if (error) {
            materialsJson.forEach((material) => {
                const itemName = name.replaceAll(' ', '')
                const materialSprite = material.name.replace(/'/, '').replaceAll(' ', '-').toLowerCase() + '.png'
                const materialName = material.name.replace(' ', '')

                if (ignoreCase.equals(itemName, materialName)) {
                    error = false

                    sprite = process.env.PWD + '/assets/items/sprites/materials/' +  materialSprite
                    embed.setThumbnail(`attachment://${materialSprite}`)
                    embed.addFields([
                        { name: '❯ Item name', value: material.name },
                        { name: '❯ Stats', value: stats },
                        { name: '❯ Price', value: price }
                    ])
                }
            })
        }

        if (!error) {
            sendMessage(message, interaction, {
                embeds: [
                    embed
                ],
                files: [
                    sprite
                ]
            })
        } else {
            const error = new MessageEmbed()
                .setAuthor(user.tag, user.displayAvatarURL())
                .setThumbnail('attachment://error.png')
                .setDescription('Make sure the item you typed is correct.\n' + 
                                'Items currently available:\n' +
                                'weapons, equipments, materials')
                .setColor('RED')

            sendMessage(message, interaction, {
                embeds: [
                    error
                ],
                files: [
                    sprite
                ]
            })
        } 
    } 
}
