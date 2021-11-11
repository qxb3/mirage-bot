const { MessageEmbed } = require('discord.js')
const fs = require('fs')
const ignoreCase = require('ignore-case')

module.exports = class Enchantments {
    constructor() {}

    async run(author, avatar, message, option, prefix) {
        const json = JSON.parse(Buffer.from(fs.readFileSync(process.env.PWD + '/assets/wiki/enchantments.json').toString()))

        if (option != undefined && !ignoreCase.equals(option, 'list')) {
            let code = 1
            await json.forEach(data => {
                //If the userinput enchant matches to enchantments list,
                //we reply the enchant full info
                if (ignoreCase.equals(option, data.enchantment)) {
                    code = 0

                    let materialsRequired = ''
                    data.materials_required.forEach(material => {
                        materialsRequired += `• ${material}\n`
                    })

                    return message.reply({
                        embeds: [
                            new MessageEmbed()
                            .setAuthor(author, avatar)
                            .addFields([
                                { name: '❯ Enchantment', value: data.enchantment },
                                { name: '❯ Enchanter', value: data.enchanter },
                                { name: '❯ Location', value: data.location },
                                { name: '❯ Materials Required', value: materialsRequired }
                            ])
                            .setColor('DARK_RED')
                        ]
                    })
                }
            })

            //if code == 1 that means the userinput did not matches any enchantments,
            //we reply with the error message
            if (code == 1) {
                return message.reply({
                    embeds: [
                        new MessageEmbed()
                        .setAuthor(author, avatar)
                        .setDescription(`What the hell is ${option}!?\nHint: ${prefix}wiki enchantments <enchantment>`)
                        .setColor('RED')
                    ]
                })
            }
        } else {
            let list = ''
            await json.forEach(data => {
                list += `❯ ${data.enchantment}\n`
            })

            message.reply({
                embeds: [
                    new MessageEmbed()
                    .setTitle('All enchantments on the game')
                    .setAuthor(author, avatar)
                    .setDescription(`${list}\nHint: ${prefix}wiki enchantments <enchantment>`)
                    .setColor('DARK_RED')
                ]
            })
        }
    }
}
