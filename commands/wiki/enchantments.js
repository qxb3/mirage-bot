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

        const enchantmentJson = JSON.parse(Buffer.from(fs.readFileSync(process.env.PWD + '/assets/wiki/enchantments.json').toString()))
        const categories = []
        enchantmentJson.forEach(enchantment => {
            categories.push(enchantment.enchantment)
        })

        //If there is no argument defined
        if (args[0] == undefined) {
            return new MessageEmbed() 
                .setAuthor(username + tag, avatar)
                .addField('❯ Usage', `${prefix}enchantments <enchantment>\n${prefix}enchantments list - To lists all enchantments in the game`)
                .setColor('RED')
        }

        //List the enchantments
        if (ignoreCase.equals(args[0], 'list')) {
            const list = getCategories(categories)
            return new MessageEmbed() 
                .setAuthor(username + tag, avatar)
                .addField('❯ Enchantments', list)
                .addField('❯ Usage', `${prefix}enchantments <enchantment>`)
                .setColor('BLUE')
        }

        //Show full details of a enchantment
        if (!ignoreCase.equals(args[0], 'list')) {
            let code = 1
            enchantmentJson.forEach(enchantment => {
                if (ignoreCase.equals(args.join(' '), enchantment.enchantment)) {
                    code = 0

                    let materialsRequired = ''
                    enchantment.materials_required.forEach(material => {
                        materialsRequired += `• ${material}\n`
                    })

                    const embed = new MessageEmbed()
                        .setAuthor(username + tag, avatar)
                        .addFields([
                            { name: '❯ Enchantment', value: enchantment.enchantment },
                            { name: '❯ Enchanter', value: enchantment.enchanter },
                            { name: '❯ Location', value: enchantment.location },
                            { name: '❯ Materials Required', value: materialsRequired }
                        ])
                        .setColor('BLUE')

                    message.reply({
                        embeds: [embed]
                    })
                }
            })

            //If the enchantment user typed didn't exist
            if (code == 1) {
                const embed = new MessageEmbed()
                    .setAuthor(username + tag, avatar)
                    .setDescription('Make sure the enchantment you type is valid')
                    .addField('❯ Usage', `${prefix}enchantments list - To list all enchantments in the game` )
                    .setColor('RED')

                return embed
            }
        }
    }
}
