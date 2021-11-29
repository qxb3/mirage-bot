const { MessageEmbed } = require('discord.js')
const Utils = require('../../utils/utils')

const ignoreCase = require('ignore-case')
const utils = new Utils()
const fs = require('fs')

module.exports = {
    category: 'Help',
    description: 'A help command that will help you get started with the bot.',

    slash: 'both',

    expectedArgs: '<command>',
    options: [
        {
            name: 'command',
            description: 'The name of the command you want to check.',
            required: false,
            type: 3
        }
    ],

    callback: ({ message, interaction, instance, args, prefix }) => {
        const messageDetails = utils.getMessageDetails(message, interaction, prefix)
        const help = JSON.parse(Buffer.from(fs.readFileSync(process.env.PWD + '/assets/help.json').toString()))

        //List the commands
        if (!args[0]) {
            let wiki = ''
            help.wiki.commands.forEach((data, i) => {
                wiki += data
                if (i != help.wiki.commands.length-1)
                    wiki += ', '
            })

            let items = ''
            help.items.commands.forEach((data, i) => {
                items += data
                if (i != help.items.commands.length-1)
                    items += ', '
            })

            let h = ''
            help.help.commands.forEach((data, i) => {
                h += data
                if (i != help.help.commands.length-1)
                    h += ', '
            })

            const embed = new MessageEmbed()
                .setTitle('Help - Commands')
                .setThumbnail('attachment://help.png')
                .addFields([
                    { name: '❯ Wiki', value: wiki },
                    { name: '❯ Items', value: items },
                    { name: '❯ Help', value: h },
                    { name: '❯ Usage', value: `${messageDetails.prefix}<command>` }
                ])
                .setColor('BLUE')

            return utils.sendMessage(message, interaction, {
                embeds: [
                    embed
                ],
                files: [
                    process.env.PWD + '/assets/icons/help.png'
                ]
            })
        }

        let code = 1
        instance.commandHandler.commands.forEach((command) => { 
            command.names.forEach((name) => { 
                if (ignoreCase.equals(args.join(' '), name)) {
                    code = 0

                    const aliases = command.names.join(', ')
                    const embed = new MessageEmbed()
                        .setThumbnail('attachment://info_blue.png')
                        .addFields(
                            { name: '❯ Name', value: name },
                            { name: '❯ Description', value: command.description },
                            { name: '❯ Aliases', value: aliases },
                            { name: '❯ Usage', value: `${messageDetails.prefix + name} ${command.syntax}` }
                        )
                        .setColor('BLUE')

                    utils.sendMessage(message, interaction, {
                        embeds: [
                            embed
                        ],
                        files: [
                            process.env.PWD + '/assets/icons/info_blue.png'
                        ]
                    })
                }
            })
        })

        //If the command name user typed did not exist
        if (code == 1) { 
            const embed = new MessageEmbed()
                .setThumbnail('attachment://error.png')
                .setDescription('Make sure the command name you typed exist')
                .addField('❯ Usage', `${messageDetails.prefix}help <command>`)
                .setColor('RED')

            utils.sendMessage(message, interaction, {
                embeds: [
                    embed
                ],
                files: [
                    process.env.PWD + '/assets/icons/error.png'
                ]
            })
        }
    }
}
