const vocationsJson = require('@assets/wiki/vocations.json')

const { sendMessage, formatter } = require('@utils/utils')
const { createEmbed } = require('@utils/responses')
const { BrandingColors } = require('@utils/constants')

const didyoumean = require('didyoumean2').default

module.exports = {
    category: 'Wiki',
    description: 'A command that will helps you identify vocations in the game.',
    aliases: ['vocation', 'vocs', 'voc'],

    slash: 'both',

    expectedArgs: '<vocation>',
    options: [
        {
            name: 'vocation',
            description: 'The name of the vocation you want to check.',
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
            value: `${prefix}vocations <vocation> - To see the full details of the food.\n` +
                   `${prefix}vocations - To list all the vocations.`
        }

        //If user didn't give arguments
        if (args.length === 0) {
            const vocations = formatter(vocationsJson.map(data => data.name))

            embed.setThumbnail('attachment://knight.png')
            embed.addFields([
                { name: '❯ Vocations', value: vocations },
                usage
            ])

            await sendMessage(message, interaction, {
                embeds: [ embed ],
                files: [ 'assets/wiki/sprites/vocations/knight.png' ]
            })
            return
        }

        const input = args.join(' ')
        const isVocation = didyoumean(input, vocationsJson.map(data => data.name), { threshold: 0.6 })

        //If the user input is vocation
        if (isVocation) {
            const vocation = vocationsJson.find(data => data.name === isVocation)
            const sprite = vocation.name.replace(/'/, '').replaceAll(' ', '-').toLowerCase() + '.png'

            embed.setThumbnail(`attachment://${sprite}`)
            embed.addFields([
                { name: '❯ Name', value: vocation.name },
                { name: '❯ Description', value: vocation.description },
                { name: '❯ Weapons', value: formatter(vocation.weapons) },
                { name: '❯ Initial resistance', value: formatter(vocation.initial_resistance) }
            ])

            await sendMessage(message, interaction, {
                embeds: [ embed ],
                files: [ `assets/wiki/sprites/vocations/${sprite}` ]
            })
            return
        }

        //If didn't match anything
        embed.setThumbnail('attachment://knight.png')
        embed.setDescription('The vocation you typed did not match to any vocations.')
        embed.addFields([ usage ])
        embed.setColor(BrandingColors.Error)

        await sendMessage(message, interaction, {
            embeds: [ embed ],
            files: [ 'assets/wiki/sprites/vocations/knight.png' ]
        })
    }
}
