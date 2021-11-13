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
    category: 'Wiki',
    description: 'You might came across some players saying weird things from the game like kos, pz, pk, etc.. this command helps you for that!',

    callback: async ({ message, args, prefix }) => {
        const username = message.author.username
        const tag = `#${message.author.discriminator}`
        const avatar = `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png`

        const slangJson = JSON.parse(Buffer.from(fs.readFileSync(process.env.PWD + '/assets/wiki/slangs.json').toString()))
        const categories = []
        slangJson.forEach(slang => {
            categories.push(slang.slang)
        })

        //If there is no argument defined
        if (args[0] == undefined) {
            return new MessageEmbed() 
                .setAuthor(username + tag, avatar)
                .addField('❯ Usage', `${prefix}slang <slang>\n${prefix}slang list - To lists all slangs commonly used in the game`)
                .setColor('RED')
        }

        //List the slang
        if (ignoreCase.equals(args[0], 'list')) {
            const list = getCategories(categories)
            return new MessageEmbed() 
                .setAuthor(username + tag, avatar)
                .addField('❯ Slangs', list)
                .addField('❯ Usage', `${prefix}slang <slang>`)
                .setColor('BLUE')
        }

        //Show full details of a slang
        if (!ignoreCase.equals(args[0], 'list')) {
            let code = 1
            slangJson.forEach(slang => {
                if (ignoreCase.equals(args.join(' '), slang.slang)) {
                    code = 0

                    const embed = new MessageEmbed()
                        .setAuthor(username + tag, avatar)
                        .addFields([
                            { name: '❯ Name', value: slang.name },
                            { name: '❯ Description', value: slang.description }
                        ])
                        .setColor('BLUE')

                    message.reply({
                        embeds: [embed]
                    })
                }
            })

            //If the slang user typed didn't exist
            if (code == 1) {
                const embed = new MessageEmbed()
                    .setAuthor(username + tag, avatar)
                    .setDescription('Make sure the slang you type is valid')
                    .addField('❯ Usage', `${prefix}slang list - To list all slangs commonly used in the game>`)
                    .setColor('RED')

                return embed
            }
        }
    }
}
