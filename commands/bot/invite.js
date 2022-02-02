const { MessageActionRow, MessageButton } = require('discord.js')

const { sendMessage } = require('@utils/utils')

module.exports = {
    category: 'Bot',
    description: 'Get the bot invite link.',
    aliases: ['inv'],

    slash: 'both',

    callback: async ({ message, interaction }) => {
        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setLabel('Direct Invite')
                    .setURL('https://discord.com/api/oauth2/authorize?client_id=903372467370864740&permissions=414464788545&scope=bot%20applications.commands')
                    .setStyle('LINK')
            )

        await sendMessage(message, interaction, {
            content: 'https://discordbotlist.com/bots/miragebot',
            components: [ row ]
        })
    }
}
