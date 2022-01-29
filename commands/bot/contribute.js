module.exports = {
    category: 'Bot',
    description: 'Sends the source code of the bot to those who want to contribute.',
    aliases: ['sourcecode'],
    slash: 'both',

    callback: async () => {
        return 'https://github.com/qxb3/mirage-bot'
    }
}
