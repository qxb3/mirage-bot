const mongoose = require('mongoose')

const requiredString = {
    type: String,
    required: true
}

const prefixSchema = new mongoose.Schema({
    _id: requiredString,
    prefix: requiredString
})

module.exports = mongoose.models['prefixes'] || mongoose.model('prefixes', prefixSchema)
