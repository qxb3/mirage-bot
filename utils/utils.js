const presences = require('@assets/presences.json')
const moment = require('moment-timezone')

const formatter = (array) => {
    return array.map((e) => `• ${e}`).join('\n')
}

const randomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

const getServerTime = () => {
    const getMilitaryTime = (standard) => {
        const [time, modifier] = standard.split(' ');
        let [hours, minutes] = time.split(':');

        if (hours === '12') hours = '00'
        if (hours.length === 1) hours = `0${hours}`
        if (minutes.length === 1) minutes = `0${minutes}`
        if (modifier === 'PM') hours = parseInt(hours, 10) + 12

        return `${hours}:${minutes}`;
    }

    const standard = moment(new Date()).tz('Europe/Isle_of_Man').format('h:m A')
    const military = getMilitaryTime(standard)

    return {
        standard,
        military
    }
}

const setBotActivity = (client) => {
    const serverSize = client.guilds.cache.size
    const userSize = client.guilds.cache.map((guild) => guild.memberCount).reduce((prev, current) => prev + current)
    let presence = presences[randomNumber(0, presences.length-1)]
    presence.name = presence.name
        .replace(/{server_size}/g, `${serverSize}`)
        .replace(/{user_size}/g, `${userSize}`)

    client.user.setActivity(presence)
}

const sendMessage = async (message, interaction, content, options) => {
    if (message) {
        if (options?.reply === true) {
            return await message.reply(content)
        }
        return await message.channel.send(content)
    }

    if (interaction) {
        if (options?.fetchReply === true) {
            return interaction.reply({
                ...content,
                fetchReply: true
            })
        }

        return interaction.reply(content)
    }
}

module.exports = {
    formatter,
    randomNumber,
    getServerTime,
    setBotActivity,
    sendMessage
}

