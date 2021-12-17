module.exports = (from, to, mobExp, percent) => {
    let exp = 0
    for (let i = from; i < to; i++) {
        exp += expToLvl(i + 1)
        if (i == from)
            exp *= (100 - percent) / 100
    }

    let time = 0
    if (exp > 0 && mobExp > 0) {
        time = exp / (mobExp / 60)
    }

    const timeLevel = formatTime(time)

    return {
        exp,
        time: timeLevel
    }
}

function expToLvl(level) {
    return 50.0 / 3.0 * (Math.pow(level, 3.0) - 6.0 * Math.pow(level, 2.0) + 17.0 * level - 12.0);
}

function formatTime(time) {
    if (time == Infinity)
        return "Infinity";

    let text = [];
    let s = Math.floor((time) % 60)
    let m = Math.floor((time / 60) % 60)
    let h = Math.floor((time / 60 / 60) % 24)
    let d = Math.floor((time / 60 / 60 / 24))

    if (d) text.push(d + " days")
    if (h) text.push(h + " hours")
    if (m) text.push(m + " mins")
    if (text.length == 0)
        text.push(s + " secs")

    return text.join(", ")
}
