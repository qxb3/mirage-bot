module.exports = (client) => {
    client.user.setPresence({
        status: 'ONLINE',
        afk: false,
        activities: [
            {
                name: 'hi',
                type: 'PLAYING',
                url: 'https://www.miragerealms.co.uk'
            }
        ]
    })

    const activities = [`🔰${client.guilds.cache.size} Servers🔰`, `🌏${client.users.cache.size} Users🌏`]
    let i = 0

    setInterval(() => {
        client.user.setActivity({
            type: 'WATCHING',
            name: '?help On ' + activities[i++]
        })

        if (i === activities.length) {
            i = 0
        }
    }, 5000)
}
