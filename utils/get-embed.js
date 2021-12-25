const { MessageEmbed } = require('discord.js')

module.exports = (user) => {
    const embed = new MessageEmbed()
        .setAuthor(user.username, user.avatarURL({ dynamic: true }))
        .setColor('GREEN')

    return embed
}
