const prefixSchema = require('../../schemas/prefix-schema')

module.exports = {
    category: 'Bot',
    description: 'Get or set bot prefix.',

    //slash: 'both',
    testOnly: true,

    callback: async ({ channel, args, text, instance }) => {
        const { guild } = channel

        if (args.length === 0) {
            return instance.messageHandler.get(guild, 'CURRENT_PREFIX', {
                PREFIX: instance.getPrefix(guild),
            })
        }

        if (guild) {
            const { id } = guild

            if (!instance.isDBConnected()) {
                return instance.messageHandler.get(guild, 'NO_DATABASE_FOUND')
            }

            await prefixSchema.findOneAndUpdate({
                _id: id,
            }, {
                _id: id,
                prefix: text,
            }, {
                upsert: true,
            })

            instance.setPrefix(guild, text)

            return instance.messageHandler.get(guild, 'SET_PREFIX', {
                PREFIX: text,
            })
        }

        return instance.messageHandler.get(guild, 'CANNOT_SET_PREFIX_IN_DMS')
    }
}
