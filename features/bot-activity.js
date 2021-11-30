module.exports = (client) => {
    const setBotActivity = (client) => {
        client.user.setActivity({
            type: 'WATCHING',
            name: `On ${client.guilds.cache.size} Servers!!`
        })
    }

    client.on('guildCreate', () => {
        setBotActivity(client)
    })

    client.on('guildDelete', () => {
        setBotActivity(client)
    })
}
