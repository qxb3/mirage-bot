const { MessageEmbed } = require('discord.js')
const { BrandingColors } = require('./constants')

const createEmbed = ({ color = BrandingColors.Primary, user }) => {
    const embed = new MessageEmbed()
        .setColor(color)

    if (user) {
        embed.setAuthor({ name: user.tag, iconURL: user.displayAvatarURL({ dynamic: true }) })
    }

    return embed
}

module.exports = {
    createEmbed
}
