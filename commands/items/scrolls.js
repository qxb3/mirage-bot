const scrollsJson = require('@assets/items/scrolls.json')

const sendMessage = require('@utils/send-message')
const formatter = require('@utils/formatter')
const getEmbed = require('@utils/get-embed')

const didyoumean = require('didyoumean2').default

module.exports = {
    category: 'Items',
    description: 'A command that will help you for scrolls in the game.',
    aliases: ['scroll', 'sc'],

    slash: 'both',

    expectedArg: '<scroll>',
    options: [
        {
            name: 'scroll',
            description: 'The name of the scroll that you want to check.',
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
            value: `${prefix}scrolls <scroll> - To see the full details of the scroll.\n` +
                   `${prefix}scrolls - To list all the scrolls.`
        }

        //If user didn't give arguments
        if (args.length === 0) {
            const scrolls = formatter(scrollsJson.map(data => data.name))

            embed.setThumbnail('attachment://experience-scroll.png')
            embed.addFields([
                { name: '❯ Scrolls', value: scrolls },
                usage
            ])

            sendMessage(message, interaction, {
                embeds: [ embed ],
                files: [ 'assets/items/sprites/scrolls/experience-scroll.png' ]
            })
            return
        }

        const input = args.join(' ')
        const isScroll = didyoumean(input, scrollsJson.map(data => data.name), { threshold: 0.6 })

        //If the user input is scroll
        if (isScroll) {
            const scroll = scrollsJson.find(data => data.name === isScroll)
            const sprite = scroll.name.replace(/'/, '').replaceAll(' ', '-').toLowerCase() + '.png'

            embed.setThumbnail(`attachment://${sprite}`)
            embed.addFields([
                { name: '❯ Name', value: scroll.name },
                { name: '❯ Effects', value: formatter(scroll.effects) },
            ])

            sendMessage(message, interaction, {
                embeds: [ embed ],
                files: [ `assets/items/sprites/scrolls/${sprite}` ]
            })
            return
        }

        //If didn't match anything
        embed.setThumbnail('attachment://experience-scroll.png')
        embed.setDescription('The scroll you typed did not match to any scrolls.')
        embed.addFields([ usage ])
        embed.setColor('RED')

        sendMessage(message, interaction, {
            embeds: [ embed ],
            files: [ 'assets/items/sprites/scrolls/experience-scroll.png' ]
        })
    }
}
