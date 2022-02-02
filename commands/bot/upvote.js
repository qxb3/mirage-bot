const { sendMessage } = require('@utils/utils')

module.exports = {
    category: 'Bot',
    description: 'Upvoting the bot will help me a lot.',
    aliases: ['vote'],
    slash: 'both',

    callback: async ({ message, interaction }) => {
        await sendMessage(message, interaction, 'https://discordbotlist.com/bots/miragebot/upvote')
    }
}
