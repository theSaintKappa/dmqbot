const DiscordJS = require('discord.js');
const WOKCommands = require('wokcommands');
const path = require('path');
require('dotenv').config();

const { Intents, MessageEmbed } = DiscordJS;

const client = new DiscordJS.Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Intents.FLAGS.GUILD_PRESENCES,
    ],
})

client.on('ready', async() => {
    const dbOptions = {
        keepAlive: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
    };

    const wok = new WOKCommands(client, {
        commandsDir: path.join(__dirname, 'commands'),
        testServers: ['980813190780841984'],
        botOwners: ['315531146953752578'],
        mongoUri: process.env.MONGO_URI,
        dbOptions,
    });
    wok.on('databaseConnected', async(connection, state) => {
        console.log(`The connection state is "${state}"`);
    });


    // const activities = [
    //     '/help',
    //     `${client.guilds.cache.reduce((a, b) => a + b.memberCount, 0)} moses fans!`
    // ];

    // let i = 0;
    // setInterval(() => client.user.setActivity(`${activities[i++ % activities.length]}`, { type: 'WATCHING' }), 15000);


    client.user.setActivity('/help', { type: 'WATCHING' });

    // let pingSpamActive = false;
    // module.exports = pingSpamActive;


    const user = await client.users.fetch('389021335285661707');
    // user.send('content');

    const pmEmbed = new MessageEmbed()
        .setColor('RANDOM')
        .setDescription('> ***Hey Moses! <:mosesThonk:981867313806602241>***\nJust a friendly reminder to use **\`/goodnight\`** in the <#982195725637156906> channel **before** you go to sleep**!**\n\nI don\'t feel like I\'m asking for much am I? :thinking:\n*Have a good one*!')
        .setFooter({ text: 'MosesReminders', iconURL: 'https://cdn.discordapp.com/avatars/315531146953752578/c74e42cfa5ab08a5daa5ede7365e2244.png?size=4096' })
        .setTimestamp();


    setInterval(() => {
        user.send({ embeds: [pmEmbed] });
        pmEmbed.setColor('RANDOM');
    }, 1800000);
});


const quotesChannel = '980813191556780064';
client.on('messageCreate', async(message) => {
    if (message.channel.id === quotesChannel) {
        try {
            await message.react('<:upvote:982630993997496321>');
            await message.react('<:downvote:982630978566639616>');
        } catch (err) {
            console.error(err);
        }
        return;
    }
    if (message.content === 'moses' && !message.author.bot) {

        const mosesReply = ['moses indeed', 'ey yo moses', 'moses where?', 'm0535'];
        const randomReply = Math.floor(Math.random() * mosesReply.length);

        try {
            message.channel.send('checking latency...').then(m => {
                m.edit(`${mosesReply[randomReply]}\n\nClient latency: \`${m.createdTimestamp - message.createdTimestamp}\`**ms**.\nAPI latency: \`${Math.round(client.ws.ping)}\`**ms**`);
            });
            message.react('<:mosesThonk:981867313806602241>');
        } catch (err) {
            console.log(err);
        }
    }
});


client.login(process.env.CLIENT_TOKEN);