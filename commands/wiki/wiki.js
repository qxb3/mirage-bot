const { MessageEmbed } = require('discord.js')
const fs = require('fs')
const ignoreCase = require('ignore-case')

const slang = async (author, avatar, message, option, prefix) => {
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

const vocations = async (author, avatar, message, option, prefix) => {
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

module.exports = {
    category: 'Wiki command',
    description: 'A useful information wiki about the game.',

    callback: async ({  message, args, prefix }) => { 
        const username = message.author.username
        const tag = `#${message.author.discriminator}`
        const avatar = `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png`


        const availableWiki = ['slang', 'vocations']
        let wiki = ''
        availableWiki.forEach(data => {
            wiki += `❯ ${data}\n`
        })

        if (args[0] == undefined) {
            const embed = new MessageEmbed()
                .setAuthor(username + tag, avatar)
                .setTitle('\nAvailable wikis:')
                .setDescription(`${wiki}\n\nHint: ${prefix}wiki <wiki>`)
                .setColor('DARK_RED')

            return embed
        }

        switch(args[0]) {
            case 'slang':
            case 'slangs':
                await slang(username + tag, avatar, message, args[1], prefix)
                break
            case 'voc':
            case 'vocs':
            case 'vocation':
            case 'vocations':
                await vocations(username + tag, avatar, message, args[1], prefix)
                break
        }
    }
}
