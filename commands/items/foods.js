const foodsJson = require('@assets/items/foods.json')

const sendMessage = require('@utils/send-message')
const formatter = require('@utils/formatter')
const getEmbed = require('@utils/get-embed')

const didyoumean = require('didyoumean2').default

module.exports = {
    category: 'Items',
    description: 'A command that will help you for the foods in the game.',
    aliases: ['food', 'fd'],

    slash: 'both',

    expectedArgs: '<food>',
    options: [
        {
            name: 'food',
            description: 'The name of the food that you want to check.',
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
            value: `${prefix}foods <food> - To see the full details of the food.\n` +
                   `${prefix}foods - To list all the foods.`
        }

        //If user didn't give arguments
        if (args.length === 0) {
            const foods = formatter(foodsJson.map(data => data.name))

            embed.setThumbnail('attachment://meat.png')
            embed.addFields([
                { name: '❯ Foods', value: foods },
                usage
            ])

            sendMessage(message, interaction, {
                embeds: [ embed ],
                files: [ 'assets/items/sprites/foods/meat.png' ]
            })
            return
        }

        const input = args.join(' ')
        const isFood = didyoumean(input, foodsJson.map(data => data.name), { threshold: 0.6 })

        //If the user input is food
        if (isFood) {
            const food = foodsJson.find(data => data.name === isFood)
            const sprite = food.name.replace(/'/, '').replaceAll(' ', '-').toLowerCase() + '.png'

            embed.setThumbnail(`attachment://${sprite}`)
            embed.addFields([
                { name: '❯ Name', value: food.name },
                { name: '❯ Effect', value: food.effect },
                { name: '❯ Monsters', value: formatter(food.monsters) },
            ])

            sendMessage(message, interaction, {
                embeds: [ embed ],
                files: [ `assets/items/sprites/foods/${sprite}` ]
            })
            return
        }

        //If didn't match anything
        embed.setThumbnail('attachment://meat.png')
        embed.setDescription('The food you typed did not match to any foods.')
        embed.addFields([ usage ])
        embed.setColor('RED')

        sendMessage(message, interaction, {
            embeds: [ embed ],
            files: [ 'assets/items/sprites/foods/meat.png' ]
        })
    }
}
