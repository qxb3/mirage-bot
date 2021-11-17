const { MessageEmbed } = require('discord.js')
const ignoreCase = require('ignore-case')
const fs = require('fs')

const getCategories = (categories) => {
    let list = ''
    categories.forEach(category => {
        list += `• ${category}\n`
    })
    return list
}

module.exports = {
    category: 'Mobs',
    description: 'A command that helps you find and indentify mobs in the game',

    callback: async ({ message, args, prefix }) => {
        const username = message.author.username
        const tag = `#${message.author.discriminator}`
        const avatar = `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png`

        const mobsJson = JSON.parse(Buffer.from(fs.readFileSync(process.env.PWD + '/assets/mobs/mobs.json').toString()))
        const categories = []
        mobsJson.forEach(mob => {
            categories.push(mob.name)
        })

        //If there is no argument defined
        if (args[0] == undefined) {
            return new MessageEmbed() 
                .setAuthor(username + tag, avatar)
                .addField('❯ Usage', `${prefix}mobs <mob>\n${prefix}mobs list - To lists all mobs in the game`)
                .setColor('RED')
        }

        //List the mobs
        if (ignoreCase.equals(args[0], 'list')) {
            const list = getCategories(categories)
            return new MessageEmbed() 
                .setAuthor(username + tag, avatar)
                .addField('❯ Mobs', list)
                .addField('❯ Usage', `${prefix}mobs <mob>`)
                .setColor('BLUE')
        }

        //Show full details of a mob
        if (!ignoreCase.equals(args[0], 'list')) {
            let code = 1
            mobsJson.forEach(mob => {
                if (ignoreCase.equals(args.join(' '), mob.name)) {
                    code = 0

                    let stats = ''
                    mob.stats.forEach(stat => {
                        stats += `• ${stat}\n`
                    })

                    let resistance = ''
                    mob.resistance.forEach(res => {
                        resistance += `• ${res}\n`
                    })

                    let loots = ''
                    mob.loots.forEach(loot => {
                        loots += `• ${loot}\n`
                    })

                    const embed = new MessageEmbed()
                        .setAuthor(username + tag, avatar)
                        .addFields([
                            { name: '❯ Name', value: mob.name },
                            { name: '❯ Stats', value: stats },
                            { name: '❯ Resistance', value: resistance },
                            { name: `❯ Loots`, value: loots }
                        ])
                        .setColor('BLUE')

                    message.reply({
                        embeds: [embed]
                    })
                }
            })

            //If the mob user typed didn't exist
            if (code == 1) {
                const embed = new MessageEmbed()
                    .setAuthor(username + tag, avatar)
                    .setDescription('Make sure the mob you type is valid')
                    .addField('❯ Usage', `${prefix}mobs list - To list all mobs in the game` )
                    .setColor('RED')

                return embed
            }
        }
    }
}
