const autoGzSchema = require('@models/autogz-schema')

module.exports = {
    category: 'Utilities',
    description: 'A simple feature that will auto react gz.',
    permissions: ['ADMINISTRATOR'],

    slash: 'both',
    guildOnly: true,

    expectedArgs: '[channel] [message]',
    options: [
        {
            name: 'channel',
            description: 'The channel mention.',
            required: false,
            type: 'CHANNEL'
        },
        {
            name: 'message',
            description: 'A optional message to the player.',
            required: false,
            type: 'STRING'
        }
    ],

    callback: async ({ message, interaction, guild, args }) => {
        if (args.length === 0) {
            const data = await autoGzSchema.findOne({ _id: guild.id })
            if (!data) {
                return {
                    content:  'Autogz are not set in this server.',
                    ephemeral: true,
                    custom: true
                }
            }

            return {
                content:`Autogz are set in <#${data.channel_id}>`,
                ephemeral: true,
                custom: true
            }
        }

        const sendToDb = async (guild, channelId, message) => {
            await autoGzSchema.findOneAndUpdate({
                _id: guild.id
            }, {
                _id: guild.id,
                guild_name: guild.name,
                channel_id: channelId,
                message: message
            }, {
                upsert: true
            })
        }

        if (message) {
            const channel = message.mentions.channels.first()
            if (!channel) {
                message.reply('You need to mention a channel.')
                return
            }

            args.shift()
            await sendToDb(message.guild, channel.id, args.join(' ') || '')
            message.reply(`Autogz are now set to <#${channel.id}>`)
        }

        if (interaction) {
            const channel = interaction.options.getChannel('channel')
            if (!channel) {
                interaction.reply({
                    content: 'You need to mention a channel.',
                    ephemeral: true
                })
                return
            }

            args.shift()
            await sendToDb(interaction.guild, channel.id, args.join(' ') || '')
            interaction.reply({
                content:  `Autogz are now set to <#${channel.id}>`,
                ephemeral: true
            })
        }
    }
}
