const Utils = require('../../utils/utils')
const utils = new Utils()

module.exports = {
    category: 'Utils',
    description: 'Get the bot invite link.',

    slash: 'both',

    callback: async ({ message, interaction }) => {
        utils.sendMessage(message, interaction, {
            content: 'https://discordbotlist.com/bots/miragebot'
        })
    }
}
