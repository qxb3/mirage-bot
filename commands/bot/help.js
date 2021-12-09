const { MessageEmbed } = require('discord.js')

const ignoreCase = require('ignore-case')
const fs = require('fs')
const sendMessage = require('@utils/send-message')

module.exports = {
    category: 'Bot',
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
        if (interaction) {
            prefix = '/'
        }

        //List the commands
        if (args.length === 0) {
            const embed = new MessageEmbed()
                .setTitle('Commands')
                .setThumbnail('attachment://help.png')
                .setColor('GREEN')

            const categories = fs.readdirSync('./commands')
            for (let i = categories.length - 1; i >= 0; i--)  {
                if (categories[i] != 'bot-owner') {
                    const categoryCommands = fs.readdirSync(`./commands/${categories[i]}`)

                    const name = categories[i].charAt(0).toUpperCase() + categories[i].slice(1)
                    const command = categoryCommands.join(', ').replaceAll('.js', '')
                    embed.addField(`❯ ${name}`, command)
                }
            }

            embed.addField('❯ Usage', `${prefix}help <command>`)

            sendMessage(message, interaction, {
                embeds: [ embed
                ],
                files: [ 'assets/icons/help.png' ]
            })
            return
        }

        let code = 1
        instance.commandHandler.commands.forEach((command) => { 
            command.names.forEach((name) => { 
                if (ignoreCase.equals(args.join(' '), name)) {
                    code = 0

                    const aliases = command.names.join(', ')
                    const syntax = command.syntax ? command.syntax : ''
                    const embed = new MessageEmbed()
                        .setThumbnail('attachment://info_blue.png')
                        .addFields(
                            { name: '❯ Command Name', value: name.charAt(0).toUpperCase() + name.slice(1) },
                            { name: '❯ Category', value: command.category },
                            { name: '❯ Description', value: command.description },
                            { name: '❯ Aliases', value: aliases },
                            { name: '❯ Usage', value: `${prefix + name} ${syntax}` }
                        )
                        .setColor('GREEN')

                    sendMessage(message, interaction, {
                        embeds: [ embed ],
                        files: [ 'assets/icons/info_blue.png' ]
                    })
                }
            })
        })

        //If the command name user typed did not exist
        if (code == 1) { 
            const embed = new MessageEmbed()
                .setThumbnail('attachment://error.png')
                .setDescription('Make sure the command name you typed is correct.')
                .addField('❯ Usage', `${prefix}help <command>`)
                .setColor('RED')

            sendMessage(message, interaction, {
                embeds: [ embed ],
                files: [ 'assets/icons/error.png' ]
            })
        }
    }
}
