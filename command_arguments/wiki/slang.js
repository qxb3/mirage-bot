const { MessageEmbed } = require('discord.js')
const fs = require('fs')
const ignoreCase = require('ignore-case')

module.exports = class Slang {
    constructor() {}

    async run(author, avatar, message, option, prefix) {
        const json = JSON.parse(Buffer.from(fs.readFileSync(process.env.PWD + '/assets/wiki/slangs.json').toString()))

        if (option != undefined && !ignoreCase.equals(option, 'list')) {
            let code = 1
            await json.forEach(data => {
                //If the userinput slang matches to slang list,
                //we reply the slang full info
                if (ignoreCase.equals(option, data.slang)) {
                    code = 0
                    return message.reply({
                        embeds: [
                            new MessageEmbed()
                            .setAuthor(author, avatar)
                            .addFields([
                                { name: '❯ Name', value: data.name },
                                { name: '❯ Description', value: data.description }
                            ])
                            .setColor('DARK_RED')
                        ]
                    })
                }
            })

            //if code == 1 that means the userinput did not matches any slang,
            //we reply with the error message
            if (code == 1) {
                return message.reply({
                    embeds: [
                        new MessageEmbed()
                        .setAuthor(author, avatar)
                        .setDescription(`What the hell is ${option}!?\nHint: ${prefix}wiki slang <slang>`)
                        .setColor('RED')
                    ]
                })
            }
        } else {
            let list = ''
            await json.forEach(data => {
                list += `❯ ${data.slang}\n`
            })

            message.reply({
                embeds: [
                    new MessageEmbed()
                    .setTitle('Slangs commonly used in the game')
                    .setAuthor(author, avatar)
                    .setDescription(`${list}\nHint: ${prefix}wiki slang <slang>`)
                    .setColor('DARK_RED')
                ]
            })
        }
    }
}
