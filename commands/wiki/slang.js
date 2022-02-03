const slangsJson = require('@assets/wiki/slangs.json')

const { sendMessage, formatter } = require('@utils/utils')
const { createEmbed } = require('@utils/responses')
const { BrandingColors } = require('@utils/constants')

const didyoumean = require('didyoumean2').default

module.exports = {
    category: 'Wiki',
    description: 'A command that will help you with slangs in the game.',
    aliases: ['slangs', 'sl'],

    slash: 'both',

    expectedArgs: '<slang>',
    options: [
        {
            name: 'slang',
            description: 'The name of the slang you want to check.',
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
            value: `${prefix}slang <slang> - To see the full details of the slang.\n` +
                   `${prefix}slang - To list all the slangs.`
        }

        //If user didn't give arguments
        if (args.length === 0) {
            const slangs = formatter(slangsJson.map(data => data.slang))

            embed.setThumbnail('attachment://rules.png')
            embed.addFields([
                { name: '❯ Slangs', value: slangs },
                usage
            ])

            await sendMessage(message, interaction, {
                embeds: [ embed ],
                files: [ 'assets/icons/rules.png' ]
            })
            return
        }

        const input = args.join(' ')
        const isSlang = didyoumean(input, slangsJson.map(data => data.slang), { threshold: 0.6 })

        //If the user input is slang
        if (isSlang) {
            const slang = slangsJson.find(data => data.slang === isSlang)

            embed.setThumbnail(`attachment://rules.png`)
            embed.addFields([
                { name: '❯ Name', value: slang.name },
                { name: '❯ Description', value: slang.description }
            ])

            await sendMessage(message, interaction, {
                embeds: [ embed ],
                files: [ `assets/icons/rules.png` ]
            })
            return
        }

        //If didn't match anything
        embed.setThumbnail('attachment://rules.png')
        embed.setDescription('The slang you typed did not match to any slangs.')
        embed.addFields([ usage ])
        embed.setColor(BrandingColors.Error)

        await sendMessage(message, interaction, {
            embeds: [ embed ],
            files: [ 'assets/icons/rules.png' ]
        })
    }
}
