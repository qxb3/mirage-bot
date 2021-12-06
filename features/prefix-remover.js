const prefixSchema = require('../node_modules/wokcommands/dist/models/prefixes')

module.exports = (client) => {
    client.on('guildDelete', async (guild) => { 
        await prefixSchema.findOneAndDelete({ _id: guild.id }, (err, data) => {
            if (err) throw err 
        }).clone().catch(err => console.log(err))
    })
}
