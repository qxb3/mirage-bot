const mongoose = require('mongoose')

const requiredString = {
    type: String,
    required: true
}

const autoGzSchema = new mongoose.Schema({
    _id: requiredString,
    guild_name: requiredString,
    channel_id: requiredString,
    messages: {
        type: [ String ],
        required: true
    }
})

module.exports = mongoose.models['autogz'] || mongoose.model('autogz', autoGzSchema)
