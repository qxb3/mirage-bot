const grindSchema = require('../../schemas/grind-schema')

const sendToDatabase = async ({ messageInfo, grindInfo, nextGrind }) => { 
    await grindSchema.findOneAndUpdate({
        _id: messageInfo.userId
    }, {
        _userId: messageInfo.userId,
        userName: messageInfo.userTag,
        userInfo: {
            level: grindInfo.level,
            experience: grindInfo.experience,
            money: {
                $inc: {
                    silver: grindInfo.money.silver,
                    gold: grindInfo.money.gold
                }
            }
        },
        nextGrind: {
            hours: nextGrind.hours,
            minutes: nextGrind.minutes,
            day: nextGrind.day,
            month: nextGrind.month,
            year: nextGrind.year 
        },
        guild: {
            guildId: messageInfo.guidId,
            guildName: messageInfo.guildName
        }
    }, {
        upsert: true,
    })
}

module.exports = {
    category: 'Economy',
    description: 'Grind',
    aliases: ['grinds'],

    //slash: true,
    testOnly: true,
    //ownerOnly: true,
    
    /*expectedArgs: '<guild-id>',
    options: [
        {
            name: 'guild-id',
            description: 'The guild id of the server you want to check',
            requred: false,
            type: 3
        }
    ],*/

    callback: async ({ message, interaction, args, prefix }) => {
        const addDays = (date, days) => {
            const result = new Date(date);
            result.setDate(result.getDate() + days);
            return result;
        }
        const currentDate = new Date()
        const date = addDays(new Date(), 1)

        if (message) {
            await sendToDatabase({
                messageInfo: {
                    userId: message.author.id,
                    userTag: message.author.tag,
                    guildId: message.guild.id,
                    guildName: message.guild.name
                },
                grindInfo: {
                    level: 1,
                    experience: 69420,
                    money: {
                        silver: 69420,
                        gold: 2
                    }
                },
                nextGrind: {
                    hours: date.getHours(),
                    minutes: date.getMinutes(),
                    day: date.getDate(),
                    month: date.getMonth(),
                    year: date.getFullYear() 
                }
            })

            message.channel.send('Done')
        }
    }
}
