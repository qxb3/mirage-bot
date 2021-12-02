const mongoose = require('mongoose')

const requiredString = {
    type: String,
    required: true
}

const logSchema = new mongoose.Schema({
    _id: requiredString,
    guildId: requiredString,
    guildName: requiredString,
    logs: [
        { 
            user: requiredString,
            command: requiredString,
            date: requiredString
        }
    ]
})

module.exports = mongoose.models['logs'] || mongoose.model('logs', logSchema)
