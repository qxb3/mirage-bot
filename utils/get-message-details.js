module.exports = (message, interaction, prefix) => {
    if (message) {
        return {
            author: message.author.username + '#' + message.author.discriminator,
            avatar: 'https://cdn.discordapp.com/avatars/' + message.author.id + '/' + message.author.avatar + '.png',
            prefix: prefix                                                    }
    }

    if (interaction) {
        return {
            author: interaction.user.username + '#' + interaction.user.discriminator,
            avatar: 'https://cdn.discordapp.com/avatars/' + interaction.user.id + '/' + interaction.user.avatar + '.png',
            prefix: '/'
        }
    }
}
