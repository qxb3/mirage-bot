const didyoumean = require('didyoumean2').default

module.exports = (client, instance) => {
    client.on('messageCreate', (message) => {
        if (message.author.bot && !message.content.startsWith('?')) return

        const { commands } = instance.commandHandler

        if (commands.map(command => command.names).flat().some(command => command === message.content.substring(1))) return

        const cmds = commands.map(command => command.names[0])
        const matchedCommands = didyoumean(message.content.substring(1), cmds, { returnType: 'all-matches' })

        message.reply(
            '```\n' +
            'Command Not Found\n\n' +
            `${matchedCommands.length !== 0 ? 'Did you mean:\n' : ''}` +
            `${matchedCommands.length !== 0 ? matchedCommands.map(command => `• ${command}`).join('\n') : ''}` +
            '\n```'
        )
    })

}

module.exports.config = {
    displayName: 'Command Not Found',
    dbName: 'COMMAND_NOT_FOUND'
}
