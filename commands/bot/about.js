const { MessageActionRow, MessageButton } = require('discord.js')

const { sendMessage } = require('@utils/utils')
const { createEmbed } = require('@utils/responses')
const { BrandingColors } = require('@utils/constants')

module.exports = {
    category: 'Bot',
    description: 'About command for information about the bot',

    slash: 'both',

    callback: async ({ message, interaction }) => {
        const row1 = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setLabel('Invite Bot')
                    .setURL('https://discord.com/api/oauth2/authorize?client_id=903372467370864740&permissions=414464788545&scope=bot%20applications.commands')
                    .setStyle('LINK')
            )

        const row2 = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setLabel('Discord Server')
                    .setURL('https://discord.gg/7PKhEk4NAe')
                    .setStyle('LINK')
            )

        const embed = createEmbed({ color: BrandingColors.Secondary })
            .setTitle('MirageHelper')
            .setThumbnail('attachment://mirage.png')
            .setDescription('MirageHelper is a open source discord bot for mirage realms Made by qxb3#4312 (ZeVEn in game).')
            .addFields([
                { name: '❯ Version', value: 'v1.' },
                { name: '❯ Found a bug? Contact me', value: '• Discord: [qxb3#4312](https://discord.com/users/591150858830479381)' },
                { name: '❯ Discord Server', value: '• [MirageHelper Server](https://discord.gg/7PKhEk4NAe)' },
                { name: '❯ Source code', value: '[mirage-bot](https://github.com/qxb3/mirage-bot)' },
                { name: '❯ Special thanks', value: '• Anonym - I used his wiki for the items, weapons and other stuff!\nHis wiki: [Pirate Wiki](http://mr.golitsyn.com/)' }, 
            ])

        await sendMessage(message, interaction, {
            embeds: [ embed ],
            components: [ row1, row2 ],
            files: [ 'assets/icons/mirage.png' ]
        })
    }
}
