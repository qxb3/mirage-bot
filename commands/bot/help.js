const { MessageActionRow, MessageButton } = require('discord.js')

const fs = require('fs')
const { sendMessage, ignoreCase } = require('@utils/utils')
const { createEmbed } = require('@utils/responses')
const { BrandingColors } = require('@utils/constants')

module.exports = {
    category: 'Bot',
    description: 'A help command that will help you get started with the bot.',
    aliases: ['commands'],
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

    callback: async ({ message, interaction, instance, args, prefix }) => {
        if (interaction) {
            prefix = '/'
        }

        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setLabel('Support Server')
                    .setURL('https://discord.gg/7PKhEk4NAe')
                    .setStyle('LINK')
            )

        //List the commands
        if (args.length === 0) {
            const embed = createEmbed()
                .setTitle('Commands')
                .setDescription('Join our discord server if you have more questions and to get updated with the bot: https://discord.gg/FnSBheNj')
                .setThumbnail('attachment://help.png')

            const categories = fs.readdirSync('./commands')
            for (let i = categories.length - 1; i >= 0; i--)  {
                if (categories[i] != 'owner') {
                    const categoryCommands = fs.readdirSync(`./commands/${categories[i]}`)

                    const name = categories[i].charAt(0).toUpperCase() + categories[i].slice(1)
                    const command = categoryCommands.join(', ').replaceAll('.js', '')
                    embed.addField(`❯ ${name}`, command)
                }
            }

            embed.addField('❯ Usage', `${prefix}help <command>`)

            await sendMessage(message, interaction, {
                embeds: [ embed
                ],
                files: [ 'assets/icons/help.png' ],
                components: [ row ]
            })
            return
        }

        let code = 1
        instance.commandHandler.commands.forEach((command) => {
            command.names.forEach(async (name) => {
                if (ignoreCase(args.join(' '), name)) {
                    if (command.category !== 'Owner') {
                        code = 0

                        const aliases = command.names.join(', ')
                        const syntax = command.syntax ? command.syntax : ''
                        const embed = createEmbed()
                            .setThumbnail('attachment://info_blue.png')
                            .addFields(
                                { name: '❯ Command Name', value: name.charAt(0).toUpperCase() + name.slice(1) },
                                { name: '❯ Category', value: command.category },
                                { name: '❯ Description', value: command.description },
                                { name: '❯ Aliases', value: aliases },
                                { name: '❯ Usage', value: `${prefix + name} ${syntax}` }
                            )

                        await sendMessage(message, interaction, {
                            embeds: [ embed ],
                            files: [ 'assets/icons/info_blue.png' ],
                            components: [ row ]
                        })
                    }
                }
            })
        })

        //If the command name user typed did not exist
        if (code == 1) {
            const embed = createEmbed({ color: BrandingColors.Error })
                .setThumbnail('attachment://error.png')
                .setDescription('Make sure the command name you typed is correct.')
                .addField('❯ Usage', `${prefix}help <command>`)

            await sendMessage(message, interaction, {
                embeds: [ embed ],
                files: [ 'assets/icons/error.png' ]
            })
        }
    }
}
