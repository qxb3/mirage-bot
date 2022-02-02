module.exports = {
    category: 'Bot',
    description: 'Get the bot latency',
    slash: 'both',

    callback: async ({ message, interaction }) => {
        if (message) {
            await message.channel.send('Calculating latency...').then(result => {
                const latency = result.createdTimestamp - message.createdTimestamp
                result.edit(`This message took me ${latency}ms to send!`)
            })
        }

        if (interaction) {
            const msg = await interaction.reply({ content: 'Calculating latency...', fetchReply: true })
            const latency = msg.createdTimestamp - interaction.createdTimestamp
            interaction.editReply(`This message took me ${latency}ms to send!`)
        }
    }
}
