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
    description: 'A command that helps you identify vocations in the game',

    callback: async ({ message, args, prefix }) => {
        const username = message.author.username
        const tag = `#${message.author.discriminator}`
        const avatar = `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png`

        const vocationJson = JSON.parse(Buffer.from(fs.readFileSync(process.env.PWD + '/assets/wiki/vocations_info.json').toString()))
        const categories = []
        vocationJson.forEach(vocation => {
            categories.push(vocation.name)
        })

        //If there is no argument defined
        if (args[0] == undefined) {
            return new MessageEmbed() 
                .setAuthor(username + tag, avatar)
                .addField('❯ Usage', `${prefix}vocations <vocation>\n${prefix}vocations list - To lists all vocations available in the game`)
                .setColor('RED')
        }

        //List the enchantments
        if (ignoreCase.equals(args[0], 'list')) {
            const list = getCategories(categories)
            return new MessageEmbed() 
                .setAuthor(username + tag, avatar)
                .addField('❯ Vocations', list)
                .addField('❯ Usage', `${prefix}vocations <vocation>`)
                .setColor('BLUE')
        }

        //Show full details of a vocation
        if (!ignoreCase.equals(args[0], 'list')) {
            let code = 1
            vocationJson.forEach(vocation => {
                if (ignoreCase.equals(args.join(' '), vocation.name)) {
                    code = 0

                    let weapons = ''
                    vocation.weapons.forEach(weapon => {
                        weapons += `• ${weapon}\n`
                    })

                    let initialResistance = ''
                    vocation.initial_resistance.forEach(resistance => {
                        initialResistance += `• ${resistance}\n`
                    })

                    const embed = new MessageEmbed()
                        .setAuthor(username + tag, avatar)
                        .addFields([
                            { name: '❯ Name', value: vocation.name },
                            { name: '❯ Weapons', value: weapons },
                            { name: '❯ Description', value: vocation.description },
                            { name: '❯ Initial Resistance', value: initialResistance }
                        ])
                        .setColor('BLUE')

                    message.reply({
                        embeds: [embed]
                    })
                }
            })

            //If the vocation user typed didn't exist
            if (code == 1) {
                const embed = new MessageEmbed()
                    .setAuthor(username + tag, avatar)
                    .setDescription('Make sure the vocation you type is valid')
                    .addField('❯ Usage', `${prefix}vocations list - To list all vocations available in the game` )
                    .setColor('RED')

                return embed
            }
        }
    }
}
