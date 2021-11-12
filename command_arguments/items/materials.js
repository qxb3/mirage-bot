const { MessageEmbed } = require('discord.js')
const ignoreCase = require('ignore-case')
const fs = require('fs')

module.exports = class Slang {
    constructor() {}

    async run(author, avatar, message, material, prefix) {
        const materials = JSON.parse(Buffer.from(fs.readFileSync(process.env.PWD + '/assets/items/materials.json').toString()))

        const getMaterialList = async (materials) => {
            let list = ''
            await materials.forEach(material => {
                list += `• ${material.name}\n`
            })
            return list
        }

        //List all the materials
        if (material == '' || ignoreCase.equals(material, 'list')) {
            const list = await getMaterialList(materials)
            return message.reply({
                embeds: [
                    new MessageEmbed()
                        .setAuthor(author, avatar)
                        .addField('Available - Materials', list)
                        .setColor('DARK_RED')
                ]
            })
        }
        // List the information of a material
        else if (material != '' || !ignoreCase.equals(material, 'list')) {
            let code = 1
            await materials.forEach(data => {
                if (ignoreCase.equals(material, data.name)) {
                    code = 0
                    let droppedFrom = ''
                    data.dropped_from.forEach(mob => {
                        droppedFrom += `• ${mob}\n`
                    })

                    return message.reply({
                        embeds: [
                            new MessageEmbed()
                                .setAuthor(author, avatar)
                                .addFields([
                                    { name: '❯ Name', value: data.name },
                                    { name: 'Dropped from', value: droppedFrom }
                                ])
                                .setColor('DARK_RED')
                        ]
                    })
                }
            })

            if (code == 1) {
                return message.reply({
                    embeds: [
                        new MessageEmbed()
                            .setAuthor(author, avatar)
                            .setDescription(`Bro, are you drunk? What the hell is ${material}\n`)
                            .addField('❯ Usage', `${prefix}items materials <material>\n${prefix}items materials list - To list all available materials`)
                            .setColor('DARK_RED')
                    ]
                })
            }
        }
    }
}
