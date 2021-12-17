const sendMessage = require('@utils/send-message')
const formatter = require('@utils/formatter')
const calculateSkill = require('@utils/calculate-skill')
const getEmbed = require('@utils/get-embed')

const didyoumean = require('didyoumean2').default

module.exports = {
    category: 'Calcs',
    description: 'A command that will help you calculating skills.',
    aliases: ['skills'],

    slash: 'both',

    expectedArgs: '<vocation> <from> <to> <skill-percent>',
    options: [
        {
            name: 'vocation',
            description: 'The vocation.',
            required: true,
            type: 'STRING'
        },
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
            name: 'skill-percent',
            description: 'The current percentage of the skill.',
            required: true,
            type: 'FLOAT'
        }
    ],

    callback: async ({ message, interaction, args, prefix, user }) => {
        const vocations = ['Knight', 'Ranger', 'Mage']
        const embed = getEmbed(user)

        if (interaction) {
            prefix = '/'
        }

        const usage = {
            name: '❯ Usage',
            value: `${prefix}skill <vocation> <from> <to> <percent> - To perform a calculation.\n` +
                   `${prefix}skill - To list all the calculation types.`
        }

        //If user didn't put arguments
        if (args.length === 0) {
            embed.setThumbnail('attachment://rules.png')
            embed.addFields([
                { name: '❯ Vocations', value: formatter(vocations) },
                usage
            ])
            
            sendMessage(message, interaction, {
                embeds: [ embed ],
                files: [ 'assets/icons/rules.png' ]
            })
            return
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

        const vocation = didyoumean(args[0], vocations, { threshold: 0.6 })
        const from = parseInt(args[1],)
        const to = parseInt(args[2])
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

        if (vocation) { 
            const calc = calculateSkill(vocation, from, to, percent)
            
            embed.setThumbnail('attachment://rules.png')
            embed.addField('❯ Skill calculation', `${calc.skill_type} (Time): ${calc.time_hits}\n` +
                                                  `Defence (Time): ${calc.time_defence}`)

            sendMessage(message, interaction, {
                embeds: [ embed ],
                files: [ 'assets/icons/rules.png' ]
            })
            return
        }

        //If didn't match anything
        embed.setThumbnail('attachment://rules.png')
        embed.setDescription('The vocation you typed did not match to any vocations.')
        embed.addFields([ usage ])
        embed.setColor('RED')

        sendMessage(message, interaction, {
            embeds: [ embed ],
            files: [ 'assets/icons/rules.png' ]
        })
    }
}
