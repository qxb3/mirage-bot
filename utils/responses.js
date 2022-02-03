const { MessageEmbed } = require('discord.js')
const { BrandingColors } = require('./constants')

const createEmbed = (options) => {
    const color = BrandingColors.Primary
    const embed = new MessageEmbed()
        .setColor(options?.color || color)

    if (options?.user) {
        embed.setAuthor({ name: options.user.tag, iconURL: options.user.displayAvatarURL({ dynamic: true }) })
    }

    return embed
}

module.exports = {
    createEmbed
}
