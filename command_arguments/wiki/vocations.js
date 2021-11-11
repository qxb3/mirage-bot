const { MessageEmbed } = require('discord.js')
const ignoreCase = require('ignore-case')
const fs = require('fs')

module.exports = class Vocations {
    async run(author, avatar, message, option, prefix) {
        const json = JSON.parse(Buffer.from(fs.readFileSync(process.env.PWD + '/assets/wiki/vocations_info.json').toString()))

        if (option != undefined && !ignoreCase.equals(option, 'list')) {
            let code = 1
            await json.forEach(data => {
                //If the userinput slang matches to slang list,
                //we reply the slang full info
                if (ignoreCase.equals(option, data.name)) {
                    code = 0

                    let weapons = ''
                    data.weapons.forEach(weapon => {
                        weapons += `• ${weapon}\n`
                    })

                    let resistance = ''
                    data.initial_resistance.forEach(res => {
                        resistance += `• ${res}\n`
                    })

                    return message.reply({
                        embeds: [
                            new MessageEmbed()
                            .setAuthor(author, avatar)
                            .addFields([
                                { name: '❯ Name', value: data.name },
                                { name: '❯ Weapons', value: weapons },
                                { name: '❯ Description', value: data.description },
                                { name: '❯ Resistance', value: resistance }
                            ])
                            .setColor('DARK_RED')
                        ]
                    })
                }
            })

            //if code == 1 that means the userinput did not matches any slang,
            //we reply with the error message
            if (code == 1) {
                message.reply({
                    embeds: [
                        new MessageEmbed()
                        .setAuthor(author, avatar)
                        .setDescription(`What the hell is ${option}!?\nHint: ${prefix}wiki vocations <vocation>`)
                        .setColor('RED')
                    ]
                })
            }
        } else {
            let list = ''
            await json.forEach(data => {
                list += `❯ ${data.name}\n`
            })

            message.reply({
                embeds: [
                    new MessageEmbed()
                    .setTitle('Available vocations:')
                    .setAuthor(author, avatar)
                    .setDescription(`${list}\nHint: ${prefix}wiki vocations <vocation>`)
                    .setColor('DARK_RED')
                ]
            })
        }
    }
}

