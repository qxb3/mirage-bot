module.exports = (vocation, from, to, percent) => {
    const vocationInfo = getVocationInfo(vocation)

    let hits = 0
    for (let i = from; i < to; i++) {
        hits += hit(i + 1, vocationInfo.skill_multiplier)
        if (i === from) {
            hits *= (100 - percent) / 100
        }
    }

    let defences = 0
    for (let i = from; i < to; i++) {
        defences += hit(i + 1, vocationInfo.defence_multiplier)
        if (i ==  from)
            defences *= (100 - percent) / 100
    }

    const timeHits = format(hits)
    const timeDefence = format(defences)

    return {
        skill_type: vocationInfo.skill_type,
        time_hits: timeHits,
        time_defence: timeDefence
    }
}

function hit(level, multiplier) {
    level -= 3
    return Math.ceil((level * Math.pow(1.0825, level) + (1.0825 * level) + 30.0) * multiplier)
}

function getVocationInfo(vocation) {
    switch(vocation) {
        case 'Knight':
            return {
                skill_type: 'Melee',
                skill_multiplier: 1.2,
                defence_multiplier: 0.8
            }
        case 'Ranger':
            return {
                skill_type: 'Distance',
                skill_multiplier: 1.0,
                defence_multiplier: 1.0
            }
        case 'Mage':
            return {
                skill_type: 'Magic',
                skill_multiplier: 0.8,
                defence_multiplier: 1.2
            }
        default:
            return {
                skill_type: 'Unknown',
                skill_multiplier: 0.0,
                defence_multiplier: 0.0
            }
    }
}

function format(hits) {
    const cooldown = 2.3185
    const time = Math.ceil(hits * cooldown)
    return formatTime(time)
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
