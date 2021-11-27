require('dotenv').config()
const { Client, Intents, WebhookClient, MessageEmbed } = require('discord.js')

const path = require('path')
const WokCommands = require('wokcommands')

const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS
    ]
})

const setBotActivity = (client) => {
    client.user.setActivity({
        type: 'WATCHING',
        name: `On ${client.guilds.cache.size} Servers!!`
    })
}

client.on('ready', () => {
    setBotActivity(client)

    new WokCommands(client, {
        commandDir: path.join(__dirname, './commands'), 
        features: path.join(__dirname, './features'),
        testServers: ['811195710065082378']
    })
    .setDefaultPrefix('?')
    .setBotOwner('591150858830479381')
})

client.on("guildCreate", async (guild) => {
    const embed = new MessageEmbed()
        .setColor('BLUE')
        .setThumbnail(guild.iconURL({ dynamic: true }))
        .setTitle("New Server!")
        .addField("Server Name", guild.name, true)
        .addField("Server ID", guild.id, true)
        .addField("Owner ID", guild.ownerID, true)
        .addField("Owner Mention", `<@${guild.ownerID}>`, true)
        .addField("Member Count", guild.memberCount, true)
        .setFooter(client.user.username, client.config.embed.thumbnail);

        await guild.channels.cache
        .filter(channel => channel.type === "text") //added this line, should work like a charm
        .first()
        .createInvite()
        .then((invite) => embed.addField("Invite link", invite.url, true))
        .catch(() => embed.addField("Invite link", "Missing permissions", true));

    channel.send(embed);
});

client.login(process.env.BOT_TOKEN)
