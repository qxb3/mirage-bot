const { MessageEmbed } = require('discord.js')
const Utils = require('../../utils/utils')

const utils = new Utils()
const fs = require('fs')

const mongo = require('../../utils/mongo')
const prefixSchema = require('../../schemas/prefix-schema')

module.exports = {
    category: 'Bot',
    description: 'About command for information about the bot',

    //slash: 'both',

    callback: async ({ message, interaction }) => {
        await mongo().then(mongoose => {
            try {
                
            } finally {
                mongoose.connection.close()
            }
        })
    }
}
