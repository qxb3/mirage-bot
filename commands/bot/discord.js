const sendMessage = require('@utils/send-message')

module.exports = {
    category: 'Bot',
    description: 'Get the discord server invite.',

    slash: 'both',

    callback: async ({ message, interaction }) => {
        sendMessage(message, interaction, 'https://discord.gg/7PKhEk4NAe')
    }
}
