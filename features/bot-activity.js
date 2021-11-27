const setBotActivity = (client) => {
    client.user.setActivity({
        type: 'WATCHING',
        name: `On ${client.guilds.cache.size} Servers!!!`
    })
}

module.exports = (client) => {
    client.on('ready', () => {
        setBotActivity(client)
    })

    client.on('guildCreate', () => {
        setBotActivity(client)
    })

    client.on('guildDelte', () => {
        setBotActivity(client)
    })
}
