const weaponsJson = require('@assets/items/weapons.json')
const equipmentsJson = require('@assets/items/equipments.json')
const mobsJson = require('@assets/wiki/mobs.json')

const sendMessage = require('@utils/send-message')
const formatter = require('@utils/formatter')
const getEmbed = require('@utils/get-embed')

const didyoumean = require('didyoumean2').default
const ignoreCase = require('ignore-case')

module.exports = {
    category: 'Wiki',
    description: 'A command that will help you for identifying level of items, mobs etc...',
    aliases: ['levels', 'lvl'],

    //slash: 'both',
    testOnly: true,

    minArgs: 2,
    expectedArgs: '<level> <category>',
    /*options: [
        {
            name: 'level',
            description: 'The level of the items or mobs that you want to check.',
            required: true,
            type: 'INTEGER'
        },
        {
            name: 'category',
            description: 'The category of the items or mobs. Example: sword.',
            required: true,
            type: 'STRING'
        }
    ],*/

    callback: async ({ message, interaction, args, prefix, user }) => {
        const categories = ['Weapons', 'Equipments', 'Spells', /*'Mobs',*/ 'All']
        const embed = getEmbed(user)

        if (interaction) {
            prefix = '/'
        }

        const usage = {
            name: '❯ Usage',
            value: `${prefix}level <level> <category> - To see the full details of the item or mob.\n` +
                   `${prefix}level - To list all the categories.`
        }

        //If user didn't give arguments
        if (args.length === 0) {
            embed.setThumbnail('attachment://level_up.png')
            embed.addFields([
                { name: '❯ Categories', value: formatter(categories) },
                usage
            ])

            sendMessage(message, interaction, {
                embeds: [ embed ],
                files: [ 'assets/icons/level_up.png' ]
            })
        }

        const [level, category] = args

        for (let i = 0; i < categories.length; i++) {
            if (ignoreCase.equals(category, categories[i])) {
                const weapon = weaponsJson.find(data => ignoreCase.equals(data.type, categories[i]) && parseInt(level, 10) === parseInt(data.level_requirement, 10))
                const equipment = equipmentsJson.find(data => ignoreCase.equals(data.type, categories[i]) && parseInt(level, 10) === parseInt(data.level_requirement, 10))
                console.log('weap: ' + weapon)
                console.log('equip: ' + equipment)
                if (weapon) {
                    const sprite = weapon.name.replace(/'/, '').replaceAll(' ', '-').toLowerCase() + '.png'
                    const type = weapon.type.toLowerCase()

                    embed.setThumbnail(`attachment://${sprite}`)
                    embed.addFields(
                        { name: '❯ Name', value: weapon.name },
                        { name: '❯ Level requirement', value: weapon.level_requirement },
                        { name: '❯ Stats', value: formatter(weapon.stats) },
                        { name: '❯ Monsters', value: formatter(weapon.monsters) }
                    )
                    sendMessage(message, interaction, {
                        embeds: [ embed ],
                        files: [ `assets/items/sprites/weapons/${type + '/' + sprite}` ]
                    })
                    return
                }

                if (equipment) {
                    const sprite = equipment.name.replace(/'/, '').replaceAll(' ', '-').toLowerCase() + '.png'
                    const type = equipment.type.toLowerCase()

                    embed.setThumbnail(`attachment://${sprite}`)
                    embed.addFields(
                        { name: '❯ Name', value: equipment.name },
                        { name: '❯ Level requirement', value: `Level ${equipment.level_requirement}` },
                        { name: '❯ Stats', value: formatter(equipment.stats) },
                        { name: '❯ Monsters', value: formatter(equipment.monsters) }
                    )
                    sendMessage(message, interaction, {
                        embeds: [ embed ],
                        files: [ `assets/items/sprites/equipments/${type + '/' + sprite}` ]
                    })
                    return
                }
            }
        }

        /*//If didn't match anything
        embed.setThumbnail('attachment://knight.png')
        embed.setDescription('The vocation you typed did not match to any vocations.')
        embed.addFields([ usage ])
        embed.setColor('RED')

        sendMessage(message, interaction, {
            embeds: [ embed ],
            files: [ 'assets/wiki/sprites/vocations/knight.png' ]
        })*/
    }
}
