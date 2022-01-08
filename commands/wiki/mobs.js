const mobsJson = require('@assets/wiki/mobs.json')

const sendMessage = require('@utils/send-message')
const formatter = require('@utils/formatter')
const getEmbed = require('@utils/get-embed')

const didyoumean = require('didyoumean2').default

module.exports = {
    category: 'Mobs',
    description: 'A command will help you with mobs in the game.',
    aliases: ['mob', 'mb'],

    slash: 'both',

    expectedArgs: '<mob>',
    options: [
        {
            name: 'mob',
            description: 'The name of the mob you want to check.',
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
            value: `${prefix}mobs <mob> - To see the full details of the mob.\n` +
                   `${prefix}mobs - To list all the mobs.`
        }

        //If user didn't give arguments
        if (args.length === 0) {
            const mobs = formatter(mobsJson.map(data => data.name))

            embed.setThumbnail('attachment://troll.png')
            embed.addFields([
                { name: '❯ Mobs', value: mobs },
                usage
            ])

            sendMessage(message, interaction, {
                embeds: [ embed ],
                files: [ 'assets/wiki/sprites/mobs/troll.png' ]
            })
            return
        }

        const input = args.join(' ')
        const isMob = didyoumean(input, mobsJson.map(data => data.name), { threshold: 0.6 })

        //If the user input is mob
        if (isMob) {
            const mob = mobsJson.find(data => data.name === isMob)
            const sprite = mob.name.replace(/'/, '').replaceAll(' ', '-').toLowerCase() + '.png'

            const stats = `• Attack: ${mob.stats.attack}\n` +
                          `• Health: ${mob.stats.health}\n` +
                          `• Skills: ${mob.stats.skills.join(', ')}\n` +
                          `• Aoe's: ${mob.stats.aoes.join(', ')}`

            embed.setThumbnail(`attachment://${sprite}`)
            embed.addFields([
                { name: '❯ Name', value: mob.name },
                { name: '❯ Level requirement', value: `Level ${mob.level_requirement}` },
                { name: '❯ Experience', value: `**Without Event:** ${mob.normal_experience} Exp\n**With Event:** ${mob.event_experience} Exp` },
                { name: '❯ Stats', value: stats },
                { name: '❯ Resistance', value: formatter(mob.resistances) },
                { name: '❯ Loots', value: formatter(mob.loots) }
            ])
            embed.setFooter('NOTE: This mob info might not be accurate.')

            sendMessage(message, interaction, {
                embeds: [ embed ],
                files: [ `assets/wiki/sprites/mobs/${sprite}` ]
            })
            return
        }

        //If didn't match anything
        embed.setThumbnail('attachment://troll.png')
        embed.setDescription('The mob you typed did not match to any mobs.')
        embed.addFields([ usage ])
        embed.setColor('RED')

        sendMessage(message, interaction, {
            embeds: [ embed ],
            files: [ 'assets/wiki/sprites/mobs/troll.png' ]
        })
    }
}
