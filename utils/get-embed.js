const { MessageEmbed } = require('discord.js')

module.exports = (user) => {
    const embed = new MessageEmbed()
        .setAuthor(user.tag, user.displayAvatarURL())
        .setColor('GREEN')

    return embed
}
