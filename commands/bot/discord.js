const { sendMessage } = require('@utils/utils')

module.exports = {
    category: 'Bot',
    description: 'Get the discord server invite.',
    slash: 'both',

    callback: async ({ message, interaction }) => {
        await sendMessage(message, interaction, 'https://discord.gg/jmcWaC829X')
    }
}
