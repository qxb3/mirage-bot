const { MessageEmbed } = require('discord.js')

module.exports = {
    category: 'Owner',
    description: 'Evaluate strings as a javascript code.',

    permissions: ['ADMINISTRATOR'],
    ownerOnly: true,
    testOnly: true,
    guildOnly: true,
    hidden: true,

    callback: async ({ message, args, prefix, guild, instance, client }) => {
        const input = args.join(' ') || 'None'
        try {
            let output = eval(input)
            output = await clean(output)

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
    },
    
    error: () => {}
}

function quote(message) {
    return '```js\n' + message + '\n```'
}

const clean = async (text) => {
    if (text && text.constructor.name == 'Promise')
        text = await text

    if (typeof text !== 'string')
        text = require('util').inspect(text, { depth: 1 })

    text = text.replaceAll(process.env.TOKEN, ' ')
    text = text.replaceAll(process.env.MONGO_URI, ' ')

    return text
}
