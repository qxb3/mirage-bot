const sendMessage = require('@utils/send-message')

module.exports = {
    category: 'Bot',
    description: 'Upvoting the bot will help me a lot.',

    slash: 'both',

    callback: ({ message, interaction }) => {
        sendMessage(message, interaction, 'https://discordbotlist.com/bots/miragebot/upvote')
    }
}
