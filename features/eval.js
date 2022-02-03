const { createEmbed } = require('@utils/responses')
const { BrandingColors } = require('@utils/constants')

const Utils = require('@utils/EvalUtils')

module.exports = (client, instance) => {
    client.on('messageCreate', async (message) => {
        const args = message.content.split(' ')
        const command = args.shift().toLowerCase()

        if (command !== `${instance.getPrefix(message.guildId)}eval`) return

        const isTestServer = instance._testServers.some(id => message.guildId === id)
        const isBotOwner = instance._botOwner.some(id => message.author.id === id)
        const isAdministrator = message.member.permissions.has('ADMINISTRATOR')

        if (!isTestServer || !isBotOwner || !isAdministrator) {
            const embed = createEmbed({ color: BrandingColors.Error })
                .setTitle('WARNING')
                .setDescription('Someone tried to access your eval command.')
                .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
                .addFields([
                    { name: '❯ User', value: message.author.tag },
                    { name: '❯ User ID', value: message.author.id },
                    { name: '❯ Guild', value: message.guild.name },
                    { name: '❯ Guild ID', value: message.guild.id },
                    { name: '❯ Command', value: args.join(' ') || 'None' },
                    { name: '❯ Permissions', value: `• isTestServer: ${isTestServer}\n• isBotOwner: ${isBotOwner}\n• isAdministrator: ${isAdministrator}` }
                ])
                .setTimestamp()

            await client.users.cache.get('591150858830479381').send({ embeds: [ embed ] })
            return
        }

        const input = args.join(` `) || 'None'

        try {
            let output = Utils.clean(await eval(input))
            if (output.length > 1024) output = 'The output is too large!'

            const embed = createEmbed()
                .addFields([
                    { name: 'INPUT:inbox_tray:', value: Utils.quote(input) },
                    { name: 'OUTPUT:outbox_tray:', value: Utils.quote(output) }
                ])
                .setTimestamp()

            await message.channel.send({ embeds: [ embed ] })
        } catch(err) {
            const embed = createEmbed({ color: BrandingColors.Error })
                .addFields([
                    { name: 'INPUT:inbox_tray:', value: Utils.quote(input) },
                    { name: 'OUTPUT:outbox_tray:', value: Utils.quote(err) }
                ])
                .setTimestamp()

            await message.channel.send({ embeds: [ embed ] })
        }
    })
}

module.exports.config = {
    displayName: 'Eval',
    dbName: 'EVAL'
}
