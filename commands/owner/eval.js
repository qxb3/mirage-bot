const { MessageEmbed } = require('discord.js')

module.exports = {
    category: 'Owner',
    description: 'Evaluate strings as a javascript code.',

    permissions: ['ADMINISTRATOR'],
    ownerOnly: true,
    testOnly: true,
    guildOnly: true,
    hidden: true,

    callback: async ({ message, args, prefix, instance }) => {
        const embed = new MessageEmbed()
            .setTimestamp()
            .setColor('GREEN')

        const input = args.join(' ')
        if (!input) {
            embed.setDescription('You need to add a code.')
            embed.setColor('RED')

            await message.channel.send({
                embeds: [ embed ]
            })
            return
        }

        let output = ''
        try {
            output = require('util').inspect(eval(`${input}`))
        } catch(err) {
            output = err
        }

        if (output.length > 1024) output = 'The output is too large!'
        embed.addFields([
            { name: 'INPUT:inbox_tray:', value: quote(input) },
            { name: 'OUTPUT:outbox_tray:', value: quote(output) }
        ])

        await message.channel.send({
            embeds: [ embed ]
        })
    },
    
    error: () => {}
}

function quote(message) {
    return '```js\n' + message + '\n```'
}
