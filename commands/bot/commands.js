const { MessageEmbed } = require('discord.js')
const ignoreCase = require('ignore-case')
const fs = require('fs')
const getMessageDetails = require('../../utils/get-message-details')
const sendMessage = require('../../utils/send-message')

module.exports = {
    category: 'Bot',
    description: 'A command that will help you get started with the bot.',

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
        const messageDetails = getMessageDetails(message, interaction, prefix)

        //List the commands
        if (!args[0]) {
            const commands = []
            const categories = fs.readdirSync('./commands')
            for (let i = categories.length - 1; i >= 0; i--) {
                if (categories[i] != 'bot-owner') {
                    const categoryCommands = fs.readdirSync(`./commands/${categories[i]}`)
                    
                    const name = categories[i].charAt(0).toUpperCase() + categories[i].slice(1)
                    const command = categoryCommands.join(', ').replaceAll('.js', '')
                    commands.push({
                        name: `❯ ${name}`,
                        value: command
                    })
                }
            }

            const embed = new MessageEmbed()
                .setTitle('Commands')
                .setThumbnail('attachment://help.png')
                .addFields(commands)
                .addField('❯ Usage', `${messageDetails.prefix}commands <command>`)
                .setColor('BLUE')

            return sendMessage(message, interaction, {
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
                    const syntax = command.syntax ? command.syntax : ''
                    const embed = new MessageEmbed()
                        .setThumbnail('attachment://info_blue.png')
                        .addFields(
                            { name: '❯ Command Name', value: name.charAt(0).toUpperCase() + name.slice(1) },
                            { name: '❯ Category', value: command.category },
                            { name: '❯ Description', value: command.description },
                            { name: '❯ Aliases', value: aliases },
                            { name: '❯ Usage', value: `${messageDetails.prefix + name} ${syntax}` }
                        )
                        .setColor('BLUE')

                    sendMessage(message, interaction, {
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
                .addField('❯ Usage', `${messageDetails.prefix}commands <command>`)
                .setColor('RED')

            sendMessage(message, interaction, {
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
