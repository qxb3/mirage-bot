const { MessageEmbed } = require('discord.js')
const fs = require('fs')

module.exports = {
    category: 'knight_command',
    description: 'A information command for knights',

    expectedArgs: '<options> <argument>',
    minArgs: 1,
    maxArgs: 2,

    callback: ({ message, args }) => {
        const username = message.author.username
        const tag = `#${message.author.discriminator}`
        const avatar = `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png`

        switch(args[0]) {
            case 'info':
                const info = JSON.parse(Buffer.from(fs.readFileSync(process.env.PWD + '/assets/vocations/knight/info.json').toString()))
                let resistance = ''
                info.initial_resistance.forEach(data => {
                    resistance += `${data}\n`
                })

                const embed = new MessageEmbed()
                    .setAuthor(`${username + tag}`, avatar)
                    .addFields([
                        { name: '❯ Name', value: info.name },
                        { name: '❯ Weapon', value: info.weapon },
                        { name: '❯ Description', value: info.description },
                        { name: '❯ Resistance', value: resistance }
                    ])
                    .setColor('DARK_RED')

                message.reply({ embeds: [embed] })
                break
            case 'items':
                if (args[1] == undefined) return 'Missing 1 argument: `?knight items <options>`'
                
                const items = JSON.parse(Buffer.from(fs.readFileSync(process.env.PWD + '/assets/vocations/knight/items.json').toString()))

                if (args[1] == 'list') { 
                    const list = []
                    items.helmet.forEach(data => {
                        let stats = ''
                        data.stats.forEach(stat => {
                            stats += `• ${stat}\n`
                        })

                        list.push(
                            { name: `❯ Name`, value: data.name },
                            { name: `❯ Requirements`, value: data.requirements },
                            { name: `❯ Stats`, value: stats },
                            { name: `❯ Drops from`, value: data.drops_from }
                        )
                    })

                    const embed = new MessageEmbed()
                        .setAuthor(`${username + tag}`, avatar)
                        .addFields(list.splice(0, 8))
                        .setColor('DARK_RED')

                    message.reply({ embeds: [embed] })
                } else {

                }
                break
            default:
                break
        }
    }
}
