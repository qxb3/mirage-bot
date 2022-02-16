const { MessageAttachment } = require('discord.js')

const logSchema = require('@models/log-schema')
const { ignoreCase } = require('@utils/utils')

module.exports = {
    category: 'Bot',
    description: 'Get the bot logs.',
    aliases: ['log'],

    testOnly: true,
    ownerOnly: true,

    expectedArgs: '<guild-id>',

    callback: async ({ message, args }) => {
        //List the servers that has logs
        if (!args[0]) {
            await message.reply(`Fetching servers that has logs`).then(async (reply) => {
                const data = await logSchema.find({})
                if (data) {
                    let servers = ''
                    data.forEach(server => {
                        servers += `Name: ${server.guildName}\n` +
                            `GuildID: ${server.guildId}\n` +
                            `Logs: ${server.logs.length}\n\n`
                    })

                    reply.edit('`❯ Server logs\n' + servers + '❯ Usage\n/logs <server-id>\n/logs all`')
                    return
                }

                reply.edit('No logs found.')
            })
            return
        }

        //List the logs on all server
        if (ignoreCase(args[0], 'all')) {
            await message.reply(`Fetching servers that has logs`).then(async (reply) => {
                const data = await logSchema.find({})
                if (data) {
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
                    reply.edit({ files: [ attachment ] })
                    return
                }

                reply.edit('No logs found.')
            })
            return
        }

        //Get the logs on a specific server
        await message.reply(`Fetching logs from ${args[0]}`).then(async (reply) => {
            const data = await logSchema.findOne({ _id: args.join(' ') })

            if (data) {
                let logs = ''
                data.logs.forEach(log => {
                    logs += log.date + ' : User: ' + log.user + ' used command: ' + log.command + '\n'
                })

                const attachment = new MessageAttachment(Buffer.from(logs, 'utf-8'), `${data.guildName}-logs.txt`)
                reply.edit({ files: [ attachment ] })
                return
            }

            reply.edit('No logs found on this server.')
        })
    },

    error: () => {}
}
