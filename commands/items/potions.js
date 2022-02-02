const potionsJson = require('@assets/items/potions.json')

const { sendMessage, formatter } = require('@utils/utils')
const { createEmbed } = require('@utils/responses')
const { BrandingColors } = require('@utils/constants')

const didyoumean = require('didyoumean2').default

module.exports = {
    category: 'Items',
    description: 'A command that will help you for potions in the game.',
    aliases: ['potion', 'pots'],
    slash: 'both',

    expectedArgs: '<potion>',
    options: [
        {
            name: 'potion',
            description: 'The name of the potion that you wanted to check.',
            required: false,
            type: 3
        }
    ],

    callback: async ({ message, interaction, args, prefix, user }) => {
        const embed = createEmbed({ user })

        if (interaction) {
            prefix = '/'
        }

        const usage = {
            name: '❯ Usage',
            value: `${prefix}potions <potion> - To see the full details of the potion.\n` +
                   `${prefix}potions - To list all the potions.`
        }

        //If user didn't give arguments
        if (args.length === 0) {
            const potions = formatter(potionsJson.map(data => data.name))

            embed.setThumbnail('attachment://health-vial.png')
            embed.addFields([
                { name: '❯ Potions', value: potions },
                usage
            ])

            await sendMessage(message, interaction, {
                embeds: [ embed ],
                files: [ 'assets/items/sprites/potions/health-vial.png' ]
            })
            return
        }

        const input = args.join(' ')
        const isPotion = didyoumean(input, potionsJson.map(data => data.name), { threshold: 0.6 })

        //If the user input is potion
        if (isPotion) {
            const potion = potionsJson.find(data => data.name === isPotion)
            const sprite = potion.name.replace(/'/, '').replaceAll(' ', '-').toLowerCase() + '.png'

            embed.setThumbnail(`attachment://${sprite}`)
            embed.addFields([
                { name: '❯ Name', value: potion.name },
                { name: '❯ Effects', value: formatter(potion.effects) },
                { name: '❯ Monsters', value: formatter(potion.monsters) },
            ])

            await sendMessage(message, interaction, {
                embeds: [ embed ],
                files: [ `assets/items/sprites/potions/${sprite}` ]
            })
            return
        }

        //If didn't match anything
        embed.setThumbnail('attachment://health-vial.png')
        embed.setDescription('The potion you typed did not match to any potions.')
        embed.addFields([ usage ])
        embed.setColor(BrandingColors.Error)

        await sendMessage(message, interaction, {
            embeds: [ embed ],
            files: [ 'assets/items/sprites/potions/health-vial.png' ]
        })
    }
}
