const { MessageEmbed } = require('discord.js')

module.exports = (user) => {
    const embed = new MessageEmbed()
        .setAuthor({ name: user.username, iconURL: user.avatarURL({ dynamic: true }) })
        .setColor('GREEN')

    return embed
}
