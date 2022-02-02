const { sendMessage } = require('@utils/utils')

module.exports = {
    category: 'Bot',
    description: 'Sends the source code of the bot to those who want to contribute.',
    aliases: ['sourcecode', 'code'],
    slash: 'both',

    callback: async ({ message, interaction }) => {
        await sendMessage(message, interaction, 'https://github.com/qxb3/mirage-bot')
    }
}
