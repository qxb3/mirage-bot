const { MessageEmbed } = require('discord.js')

module.exports = {
    callback: async ({ message, prefix }) => {
        const username = message.author.username
        const tag = `#${message.author.discriminator}`
        const avatar = `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png`

        const wiki = 
`
${prefix}wiki - Lists all the categories
${prefix}wiki list - Lists all the categories

${prefix}wiki slang - Lists all available slangs
${prefix}wiki slang list - Lists all available slangs
${prefix}wiki slang <slang> - Displays full information about the slang

${prefix}wiki vocations - Lists all available vocations
${prefix}wiki vocations list - Lists all available vocations
${prefix}wiki vocations <vocation> - Displays full information about the vocation

${prefix}wiki enchantments - Lists all available enchantments
${prefix}wiki enchantments list - Lists all available enchantments
${prefix}wiki enchantments <enchantment> - Displays full information about the enchantment
`

        const embed = new MessageEmbed()
            .setTitle('Help - Commands')
            .addFields([
                { name: '❯ Wiki', value: wiki }
            ])
            .setColor('DARK_RED')

        return embed
    }
}
