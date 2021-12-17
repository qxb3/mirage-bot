const sendMessage = require('@utils/send-message')
const calculateLevel = require('@utils/calculate-level')
const getEmbed = require('@utils/get-embed')

module.exports = {
    category: 'Calcs',
    description: 'A command that will help you calculating level.',
    aliases: ['levels', 'lvl'],

    slash: 'both',

    expectedArgs: '<from> <to> <mob-exp> <level-percent>',
    options: [ 
        {
            name: 'from',
            description: 'The starting point of the skill.',
            required: true,
            type: 'INTEGER'
        },
        {
            name: 'to',
            description: 'The ending point of the skill.',
            required: true,
            type: 'INTEGER'
        },
        {
            name: 'mob-exp',
            description: 'The exp of the mob.',
            required: true,
            type: 'INTEGER'
        },
        {
            name: 'level-percent',
            description: 'The current percentage of the skill.',
            required: true,
            type: 'NUMBER'
        }
    ],

    callback: async ({ message, interaction, args, prefix, user }) => {
        const embed = getEmbed(user)

        if (interaction) {
            prefix = '/'
        }

        const usage = {
            name: '❯ Usage',
            value: `${prefix}level <from> <to> <mob-exp> <level-percent> - To perform a calculation.`
        } 

        //If the user typed didn't meet the args requirements
        if (args.length !== 4) {
            embed.setThumbnail('attachment://rules.png')
            embed.setDescription('You need to fill up the missing fields.'),
            embed.addFields([ usage ])
            embed.setColor('RED')

            sendMessage(message, interaction, {
                embeds: [ embed ],
                files: [ 'assets/icons/rules.png' ]
            })
            return
        }

        const from = parseInt(args[0])
        const to = parseInt(args[1])
        const mobExp = parseInt(args[2])
        const percent = parseFloat(args[3].replaceAll('%', ''))

        //If from is greater than to which does not make sense
        if (from > to) {
            embed.setThumbnail('attachment://rules.png')
            embed.setDescription('The argument: `from` cannot be higher than argument: `to` ||It does not make sense bro wtf.||')
            embed.addFields([ usage ])
            embed.setColor('RED')

            sendMessage(message, interaction, {
                embeds: [ embed ],
                files: [ 'assets/icons/rules.png' ]
            })
            return
        }

        //If the percent is higher than 100%
        if (percent > 100) {
            embed.setThumbnail('attachment://rules.png')
            embed.setDescription('The argument: `percent` cannot be higher than 100%')
            embed.addFields([ usage ])
            embed.setColor('RED')

            sendMessage(message, interaction, {
                embeds: [ embed ],
                files: [ 'assets/icons/rules.png' ]
            })
            return
        }

        const calc = calculateLevel(from, to, mobExp, percent)

        embed.setThumbnail('attachment://rules.png')
        embed.addField('❯ Level calculation', `Exp required: ${parseInt(calc.exp)}\n` +
                                              `Time: ${calc.time}`)

        sendMessage(message, interaction, {
            embeds: [ embed ],
            files: [ 'assets/icons/rules.png' ]
        })
    }
}
