const enchantmentsJson = require('@assets/wiki/enchantments.json')

const sendMessage = require('@utils/send-message')
const formatter = require('@utils/formatter')
const getEmbed = require('@utils/get-embed')

const didyoumean = require('didyoumean2').default

module.exports = {
    category: 'Wiki',
    description: 'A command that will help you with enchantments in the game.',
    aliases: ['enchantment', 'enchants', 'enchant'],

    slash: 'both',

    expectedArgs: '<enchanment>',
    options: [
        {
            name: 'enchantment',
            description: 'The name of the enchantment you want to check',
            required: false,
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
            value: `${prefix}enchantments <enchantment> - To see the full details of the enchantment.\n` +
                   `${prefix}enchantments - To list all the enchantments.`
        }

        //If user didn't give arguments
        if (args.length === 0) {
            const enchantments = formatter(enchantmentsJson.map(data => data.name))

            embed.setThumbnail('attachment://physical.png')
            embed.addFields([
                { name: '❯ Enchantments', value: enchantments },
                usage
            ])

            sendMessage(message, interaction, {
                embeds: [ embed ],
                files: [ 'assets/wiki/sprites/enchantments/physical.png' ]
            })
            return
        }

        const input = args.join(' ')
        const isFood = didyoumean(input, enchantmentsJson.map(data => data.name), { threshold: 0.6 })

        //If the user input is enchantment
        if (isFood) {
            const enchantment = enchantmentsJson.find(data => data.name === isFood)
            const sprite = enchantment.name.replace(/'/, '').replaceAll(' ', '-').toLowerCase() + '.png'

            embed.setThumbnail(`attachment://${sprite}`)
            embed.addFields([
                { name: '❯ Name', value: enchantment.name },
                { name: '❯ Enchanter', value: enchantment.enchanter },
                { name: '❯ Location', value: enchantment.location },
                { name: '❯ Materials required', value: formatter(enchantment.materials_required) }
            ])

            sendMessage(message, interaction, {
                embeds: [ embed ],
                files: [ `assets/wiki/sprites/enchantments/${sprite}` ]
            })
            return
        }

        //If didn't match anything
        embed.setThumbnail('attachment://physical.png')
        embed.setDescription('The enchantment you typed did not match to any enchantments.')
        embed.addFields([ usage ])
        embed.setColor('RED')

        sendMessage(message, interaction, {
            embeds: [ embed ],
            files: [ 'assets/wiki/sprites/enchantments/physical.png' ]
        }) 
    }
}
