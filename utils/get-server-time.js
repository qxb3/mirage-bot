const moment = require('moment-timezone')

module.exports = () => {
    const normal = moment(new Date()).tz('Europe/Isle_of_Man').format('h:m A')
    const converted = convertTime12to24(normal)

    return {
        normal,
        converted
    }
}

function convertTime12to24(time12h) {
  const [time, modifier] = time12h.split(' ');
  let [hours, minutes] = time.split(':');

  if (hours === '12') {
    hours = '00';
  }

  if (hours.length === 1) {
    hours = `0${hours}`
  }

  if (minutes.length === 1) {
    minutes = `0${minutes}`
  }

  if (modifier === 'PM') {
    hours = parseInt(hours, 10) + 12;
  }

  return `${hours}:${minutes}`;
}
