const { MessageEmbed } = require('discord.js');
const axios = require('axios');
require('dotenv').config();

module.exports = {
    category: 'MentalBreakdown',
    description: 'Scrape data from cat-milk/Anime-Girls-Holding-Programming-Books using the Github API.',


    options: [{
        type: 'STRING',
        name: "language",
        description: "Choose programing language. If left blank a random language will be selected.",
        required: false
    }],


    slash: true,
    testOnly: true,

    callback: async({ interaction, args }) => {

        function reply(content, ephemeral = false) {
            if (interaction) {
                interaction.reply({
                    content,
                    ephemeral
                });
            }
        }

        const config = {
            headers: {
                Authorization: `token ${process.env.GITHUB_GET_TOKEN}`,
            }
        }

        await axios.get('https://api.github.com/repos/cat-milk/Anime-Girls-Holding-Programming-Books/contents/', config)
            .then(async response => {


                const res = response.data;

                let languagesArray = [];
                for (const language of res) {
                    if (language.name != 'README.md' && language.name != 'CONTRIBUTING.md') {
                        languagesArray.push(language);
                        language.name = language.name.toUpperCase();
                    }
                }

                randomLanguageIndex = Math.floor(Math.random() * (languagesArray.length));
                randomLanguage = languagesArray[randomLanguageIndex];

                const chosen = args[0] === undefined ? randomLanguage : languagesArray.find(lang => lang.name === args[0].toUpperCase());

                if (chosen === undefined) {
                    reply(`**Language** \`${args[0]}\` **does not exist in the repo.**`, true);
                    return;
                }

                await axios.get(chosen.url)
                    .then(async response => {
                        randomPicIndex = Math.floor(Math.random() * (response.data.length));

                        reply(`**Here is your waifu holding a** \`${chosen.path}\` **book.**\n${response.data[randomPicIndex].download_url}`);
                    })
                    .catch(error => {
                        console.error(error);
                    });
            })
            .catch(error => {
                console.error(error);
            });


    }
};