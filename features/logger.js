const ignoreCase = require('ignore-case')
const date = require('date-and-time')

const logSchema = require('../schemas/log-schema')

module.exports = async (client, instance) => {
    const sendToDatabase = async (guildId, guildName, user, commandUsed, date) => {
        await logSchema.findOneAndUpdate({
            _id: guildId
        }, {
            _id: guildId,
            guildId,
            guildName,
            $push: {
                logs: [
                    {
                        user,
                        command: commandUsed,
                        date: date
                    }
                ]
            }
        }, {
            upsert: true
        })
    }

    client.on('messageCreate', (message) => {
        if (message.content.startsWith(instance._defaultPrefix)) {
            const content = message.content.substring(instance._defaultPrefix.length).split(' ')
            instance.commandHandler.commands.forEach(command => {
                command.names.forEach(name => {
                    if (ignoreCase.equals(content[0], name)) {
                        const guildId = message.guild.id
                        const guildName = message.guild.name
                        const user = message.author.username + '#' + message.author.discriminator
                        const commandUsed = instance._defaultPrefix + content.join(' ')
                        const on = date.format(new Date(), 'MMM/DD/YYYY • h:mm A')

                        sendToDatabase(guildId, guildName, user, commandUsed, on)
                    }
                }) 
            })
        }
    })

    client.on('interactionCreate', (interaction) => {
        if (!interaction.isCommand()) return

        const guildId = interaction.guild.id
        const guildName = interaction.guild.name
        const user = interaction.user.username + '#' + interaction.user.discriminator
        const commandUsed = '/' + interaction.commandName
        const on = date.format(new Date(), 'MMM/DD/YYYY • h:mm A')

        sendToDatabase(guildId, guildName, user, commandUsed, on)
    })
}

module.exports.config = {
    displayName: 'Command Logger',
    dbName: 'COMMAND_LOGGER'
}
