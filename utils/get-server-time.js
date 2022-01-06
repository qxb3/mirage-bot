const moment = require('moment-timezone')

module.exports = () => {
    const normal = moment(new Date()).tz('Europe/Isle_of_Man').format('h:m A')
    const temp = getTwentyFourHourTime(normal).replace(':', '')
    let converted = getTwentyFourHourTime(normal)

    if (temp.length === 3) {
        const split = temp.split('')
        const last = '0' + split.pop()
        const first = split.join('')

        converted = first + ':' + last
    }
    
    return {
        normal,
        converted
    }
}

function getTwentyFourHourTime(amPmString) {
    const date = new Date("1/1/2013 " + amPmString)
    return date.getHours() + ':' + date.getMinutes()
}
