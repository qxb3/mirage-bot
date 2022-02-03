const infosJson = require('@assets/wiki/infos.json')

const { sendMessage, formatter } = require('@utils/utils')
const { createEmbed } = require('@utils/responses')
const { BrandingColors } = require('@utils/constants')

const didyoumean = require('didyoumean2').default

module.exports = {
    category: 'Wiki',
    description: 'A command for info s about the game (This command content are mostly about skull systems).',
    aliases: ['info', 'inf'],

    slash: 'both',

    expectedArgs: '<info>',
    options: [
        {
            name: 'info',
            description: 'The info name you want to check.',
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
            value: `${prefix}infos <info> - To see the full details of the info.\n` +
                   `${prefix}infos - To list all the info's available.`
        }

        //If user didn't give arguments
        if (args.length === 0) {
            const infos = formatter(infosJson.map(data => data.name))

            embed.setThumbnail('attachment://rules.png')
            embed.addFields([
                { name: `❯ Info's`, value: infos },
                usage
            ])

            await sendMessage(message, interaction, {
                embeds: [ embed ],
                files: [ 'assets/icons/rules.png' ]
            })
            return
        }

        const input = args.join(' ')
        const isInfo = didyoumean(input, infosJson.map(data => data.name), { threshold: 0.6 }) 

        //If the user input is info
        if (isInfo) {
            const info = infosJson.find(data => data.name === isInfo)
            const sprite = info.name.replace(/'/, '').replaceAll(' ', '-').toLowerCase() + '.png' 

            embed.setThumbnail(`attachment://${sprite}`)
            embed.addFields([
                { name: '❯ Name', value: info.name },
                { name: '❯ Description', value: info.description }
            ])

            await sendMessage(message, interaction, {
                embeds: [ embed ],
                files: [ `assets/wiki/sprites/infos/${sprite}` ]
            })
            return
        }

        //If didn't match anything
        embed.setThumbnail('attachment://rules.png')
        embed.setDescription('The info you typed did not match to any infos.')
        embed.addFields([ usage ])
        embed.setColor(BrandingColors.Error)

        await sendMessage(message, interaction, {
            embeds: [ embed ],
            files: [ 'assets/icons/rules.png' ]
        })
    }
}
