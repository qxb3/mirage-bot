const mongoose = require('mongoose')

const requiredString = {
    type: String,
    required: true
}

const requiredNumber = {
    type: Number,
    required: true
}

const logSchema = new mongoose.Schema({
    _id: requiredString, 
    userId: requiredString,
    userName: requiredString,
    userInfo: {
        level: requiredNumber,
        experience: requiredNumber,
        money: {
            silver: requiredNumber,
            gold: requiredNumber
        }
    },
    nextGrind: {
        hours: requiredNumber,
        minutes: requiredNumber,
        day: requiredNumber,
        month: requiredNumber,
        year: requiredNumber,
    },
    guild: {
        guildId: requiredString,
        guildName: requiredString,
    }
})

module.exports = mongoose.models['grind'] || mongoose.model('grind', logSchema)
