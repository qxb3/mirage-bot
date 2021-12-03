module.exports = (message, interaction, content) => {
    if (message) {
        message.channel.send(content)
    }

    if (interaction) {
        interaction.reply(content)
    }
}
