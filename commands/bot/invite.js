const sendMessage = require('../../utils/send-message')

module.exports = {
    category: 'Bot',
    description: 'Get the bot invite link.',

    slash: 'both',

    callback: async ({ message, interaction }) => {
        sendMessage(message, interaction, {
            content: 'https://discordbotlist.com/bots/miragebot'
        })
    }
}
