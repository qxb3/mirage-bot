const spellsJson = require('@assets/wiki/spells.json')

const { sendMessage, formatter } = require('@utils/utils')
const { createEmbed } = require('@utils/responses')
const { BrandingColors } = require('@utils/constants')

const didyoumean = require('didyoumean2').default

module.exports = {
    category: 'Wiki',
    description: 'A command that will help you for spells in the game.',
    aliases: ['spell'],

    slash: 'both',

    expectedArgs: '<spell>',
    options: [
        {
            name: 'spell',
            description: 'The name of the spell you want to check.',
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
            value: `${prefix}spells <spell> - To see the full details of the spell.\n` +
                   `${prefix}spells <category> - To list all the spells in that categories.\n` +
                   `${prefix}spells - To list all the categories.`
        }

        const categories = ['Knight', 'Ranger', 'Mage', 'Shaman']

        //If user didn't give arguments
        if (args.length === 0) {
            embed.setThumbnail('attachment://mind-games.png')
            embed.addFields([
                { name: '❯ Categories', value: formatter(categories) },
                usage
            ])

            await sendMessage(message, interaction, {
                embeds: [ embed ],
                files: [ 'assets/wiki/sprites/spells/mage/mind-games.png' ]
            })
            return
        }

        const input = args.join(' ')
        const isCategory = didyoumean(input, categories, { threshold: 0.6 })
        const isSpell = didyoumean(input, spellsJson.map(data => data.name), { threshold: 0.6 })

        //If the user input is category
        if (isCategory) {
            const spells = formatter(spellsJson.filter(data => data.vocation === isCategory).map(data => data.name))
            const sprite = `${isCategory.toLowerCase()}.png`

            embed.setThumbnail(`attachment://${sprite}`)
            embed.addFields([
                { name: `❯ ${isCategory}`, value: spells },
                usage
            ])

            await sendMessage(message, interaction, {
                embeds: [ embed ],
                files: [ `assets/wiki/sprites/spells/thumbnails/${sprite}` ]
            })
            return
        }

        //If the user input is spell
        if (isSpell) {
            const spell = spellsJson.find(data => data.name === isSpell)
            const sprite = spell.name.replace(/'/, '').replaceAll(' ', '-').toLowerCase() + '.png'
            const type = spell.vocation.toLowerCase()
            const effects = spell.effects.join('\n')

            embed.setThumbnail(`attachment://${sprite}`)
            embed.addFields(
                { name: '❯ Name', value: spell.name },
                { name: '❯ Description', value: spell.description },
                { name: '❯ Requirement', value: spell.requirement },
                { name: '❯ Cooldown', value: spell.cooldown },
                { name: '❯ Effects', value: effects }
            )
            await sendMessage(message, interaction, {
                embeds: [ embed ],
                files: [ `assets/wiki/sprites/spells/${type + '/' + sprite}` ]
            })
            return
        }

        //If didn't match anything
        embed.setThumbnail('attachment://mind-games.png')
        embed.setDescription('The spell you typed did not match to any spells.')
        embed.addFields([ usage ])
        embed.setColor(BrandingColors.Error)

        await sendMessage(message, interaction, {
            embeds: [ embed ],
            files: [ 'assets/wiki/sprites/spells/mage/mind-games.png' ]
        })
    }
}
