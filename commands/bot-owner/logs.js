const { MessageAttachment } = require('discord.js')
const logSchema = require('../../schemas/log-schema')
const ignoreCase = require('ignore-case')

module.exports = {
    category: 'BotOwner',
    description: 'Get the bot logs.',
    aliases: ['log'],

    slash: true,
    testOnly: true,
    ownerOnly: true,
    
    expectedArgs: '<guild-id>',
    options: [
        {
            name: 'guild-id',
            description: 'The guild id of the server you want to check',
            requred: false,
            type: 3
        }
    ],

    callback: async ({ interaction, args }) => {
        //List the servers that has logs
        if (!args[0]) {
            await interaction.reply({ content: `Fetching servers that has logs`, ephemeral: true, fetchReply: true }).then(async () => {
                await logSchema.find({}, (err, data) => {
                    if (err) throw err

                    if (data) {
                        let servers = ''
                        data.forEach(server => {
                            servers += `Name: ${server.guildName}\n` +
                                `GuildID: ${server.guildId}\n` +
                                `Logs: ${server.logs.length}\n\n` 
                        }) 

                        interaction.editReply({ content: '`❯ Server logs\n' + servers + '❯ Usage\n/logs <server-id>\n/logs all`', ephemeral: true })
                    } else {
                        interaction.editReply({ content: 'No logs found', ephemeral: true })
                    }
                }).clone().catch(err => console.error(err))
            })
            return
        }

        //List the logs on all server
        if (ignoreCase.equals(args[0], 'all')) {
            await interaction.reply({ content: `Fetching servers that has logs`, ephemeral: true, fetchReply: true }).then(async () => {
                await logSchema.find({}, (err, data) => {
                    if (err) throw err

                    if (data)  {
                        let logs = ''
                        data.forEach(server => {
                            logs += `Name: ${server.guildName}\n` +
                                    `GuildID: ${server.guildId}\n`

                            server.logs.forEach(log => {
                                logs += log.date + ' : User: ' + log.user + ' used command: ' + log.command + '\n'
                            })
                            logs += '\n\n\n'
                        })

                        const attachment = new MessageAttachment(Buffer.from(logs, 'utf-8'), `logs.txt`)
                        interaction.editReply({ ephemeral: true, files: [ attachment ] })
                    } else {
                        interaction.editReply({ content: 'No logs found', ephemeral: true })
                    }
                }).clone().catch(err => console.error(err))
            })
            return
        }

        //Get the logs on a specific server
        await interaction.reply({ content: `Fetching logs from ${args[0]}`, ephemeral: true, fetchReply: true }).then(async () => {
            await logSchema.findOne({ _id: args[0] }, (err, data) => {
                if (err) throw err

                if (data) {
                    let logs = ''
                    data.logs.forEach(log => {
                        logs += log.date + ' : User: ' + log.user + ' used command: ' + log.command + '\n'
                    })

                    const attachment = new MessageAttachment(Buffer.from(logs, 'utf-8'), `${data.guildName}-logs.txt`)
                    interaction.editReply({ ephemeral: true, files: [ attachment ] })
                } else {
                    interaction.editReply({ content: 'Server not found', ephemeral: true, })
                } 
            }).clone().catch(err => console.error(err)) 
        })
    }
}
