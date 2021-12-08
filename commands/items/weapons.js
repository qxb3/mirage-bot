const weaponsJson = require('@assets/items/weapons.json')
const sendMessage = require('@utils/send-message')
const formatter = require('@utils/formatter')
const getEmbed = require('@utils/get-embed')

const didyoumean = require('didyoumean2').default

module.exports = {
    category: 'Items',
    description: 'A command that will help you for weapons in the game',
    aliases: ['weapon', 'weaps', 'weap', 'wp'],

    slash: 'both',

    expectedArgs: '<weapon>',
    options: [
        {
            name: 'weapon',
            description: 'It can be the name of the weapon or a category.',
            required: false,
            type: 3
        }
    ],

    callback: async ({ message, interaction, args, prefix, user }) => { 
        const categories = ['Sword', 'Axe', 'Mace', 'Shield', 'Bow', 'Ammunition', 'Staff', 'Rod', 'Spellbook']
        const embed = getEmbed(user)

        if (interaction) {
            prefix = '/'
        }

        const usage = {
            name: '❯ Usage',
            value: `${prefix}weapons <weapon> - To see the full details of the weapon.\n` +
                   `${prefix}weapons <category> - To see all the weapons in that categories.\n` +
                   `${prefix}weapons - To sell all the categories.`
        }

        //If user didn't give arguments
        if (args.length === 0) {
            embed.setThumbnail('attachment://sword.png')
            embed.addFields([
                { name: '❯ Categories', value: formatter(categories) },
                usage
            ])

            sendMessage(message, interaction, {
                embeds: [ embed ],
                files: [ 'assets/items/sprites/weapons/thumbnails/sword.png' ]
            })
            return
        }

        const input = args.join(' ')
        const isCategory = didyoumean(input, categories, { threshold: 0.6 })
        const isWeapon = didyoumean(input, weaponsJson.map(data => data.name), { threshold: 0.6 })

        //If the user input is category
        if (isCategory) {
            const weapons = formatter(weaponsJson.filter(data => data.type === isCategory).map(data => data.name))
            const sprite = `${isCategory.toLowerCase()}.png`

            embed.setThumbnail(`attachment://${sprite}`)
            embed.addFields([
                { name: `❯ ${isCategory}`, value: weapons },
                usage
            ])

            sendMessage(message, interaction, {
                embeds: [ embed ],
                files: [ `assets/items/sprites/weapons/thumbnails/${sprite}` ]
            })
            return
        }

        //If the user input is weapon
        if (isWeapon) {
            const weapon = weaponsJson.find(data => data.name === isWeapon)
            const sprite = weapon.name.replace(/'/, '').replaceAll(' ', '-').toLowerCase() + '.png'
            const type = weapon.type.toLowerCase()

            embed.setThumbnail(`attachment://${sprite}`)
            embed.addFields(
                { name: '❯ Name', value: weapon.name },
                { name: '❯ Requirement', value: weapon.requirements },
                { name: '❯ Stats', value: formatter(weapon.stats) },
                { name: '❯ Monsters', value: formatter(weapon.monsters) }
            )
            sendMessage(message, interaction, {
                embeds: [ embed ],
                files: [ `assets/items/sprites/weapons/${type + '/' + sprite}` ]
            })
            return
        }

        //If didn't match anything
        embed.setThumbnail('attachment://sword.png')
        embed.setDescription('The weapon you typed did not match to any weapons.')
        embed.addFields([ usage ])
        embed.setColor('RED')

        sendMessage(message, interaction, {
            embeds: [ embed ],
            files: [ `assets/items/sprites/weapons/thumbnails/sword.png` ]
        }) 
    }
}
