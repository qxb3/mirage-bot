module.exports = (client) => {
    client.user.setActivity({
        type: 'WATCHING',
        name: `?. On ${client.guilds.cache.size} Servers!!`
    })
}
