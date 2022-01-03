const { MessageEmbed } = require('discord.js')

module.exports = (client, instance) => {
    client.on('messageCreate', async (message) => {
        const args = message.content.split(' ')
        const command = args.shift().toLowerCase()

        if (command !== `${instance.getPrefix(message.guildId)}eval`) return

        const isTestServer = instance._testServers.some(id => message.guildId === id)
        const isBotOwner = instance._botOwner.some(id => message.author.id === id)
        const isAdministrator = message.member.permissions.has('ADMINISTRATOR')
        
        if (!isTestServer || !isBotOwner || !isAdministrator) {
            const embed = new MessageEmbed()
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
                .setColor('RED')

            await client.users.cache.get('591150858830479381').send({ embeds: [ embed ] })
            return
        }

        const input = args.join(' ') || 'None'
        
        try {
            let output = clean(eval(input))
            if (output.length > 1024) output = 'The output is too large!'

            const embed = new MessageEmbed()
                .addFields([
                    { name: 'INPUT:inbox_tray:', value: quote(input) },
                    { name: 'OUTPUT:outbox_tray:', value: quote(output) }
                ])
                .setTimestamp()
                .setColor('GREEN')

            await message.channel.send({ embeds: [ embed ] })
        } catch(err) {
            const embed = new MessageEmbed()
                .addFields([
                    { name: 'INPUT:inbox_tray:', value: quote(input) },
                    { name: 'OUTPUT:outbox_tray:', value: quote(err) }
                ])
                .setTimestamp()
                .setColor('RED')

            await message.channel.send({ embeds: [ embed ] })
        }
    })
}

function quote(message) {
    return '```js\n' + message + '\n```'
}

const clean = (text) => {
    /*if (text && text.constructor.name == 'Promise') {
        text = await text
    }*/

    if (typeof text !== 'string') {
        text = require('util').inspect(text, { depth: 1 })
    }

    text = text.replaceAll('`', '`' + String.fromCharCode(8203))
    text = text.replaceAll('@', '@' + String.fromCharCode(8203));
    text = text.replaceAll(process.env.TOKEN, ' ')
    text = text.replaceAll(process.env.MONGO_URI, ' ')

    return text
}

module.exports.config = {
    displayName: 'Eval',
    dbName: 'EVAL'
}
