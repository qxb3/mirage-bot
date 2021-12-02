const mongoose = require('mongoose')

const requiredString = {
    type: String,
    required: true
}

const LogSchema = new mongoose.Schema({
    _id: requiredString,
    logs: {
        type: Array,
        required: true
    }
})

module.exports = mongoose.model('log-schema', LogSchema)
