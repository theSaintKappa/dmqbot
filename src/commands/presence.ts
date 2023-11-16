import { ActivityType, ClientPresenceStatus, CommandInteractionOptionResolver, SlashCommandBuilder } from "discord.js";
import Presence from "../models/bot/presence";
import { CommandObject } from "./";

export default {
    builder: new SlashCommandBuilder()
        .setName("presence")
        .setDescription("Change the bot's status.")
        .addStringOption((option) =>
            option
                .setName("type")
                .setDescription("An activity type.")
                .setRequired(true)
                .setChoices(
                    { name: "Playing", value: "0" },
                    { name: "Streaming", value: "1" },
                    { name: "Listening to", value: "2" },
                    { name: "Watching", value: "3" },
                    { name: "Competing in", value: "5" }
                )
        )
        .addStringOption((option) => option.setName("name").setDescription("The activity's name.").setRequired(true))
        .addStringOption((option) =>
            option
                .setName("status")
                .setDescription("The bot's status.")
                .setRequired(true)
                .setChoices({ name: "Online", value: "online" }, { name: "Idle", value: "idle" }, { name: "Do Not Disturb", value: "dnd" })
        ),

    run: async (interaction) => {
        const args = <CommandInteractionOptionResolver>interaction.options;
        const type: ActivityType = parseInt(args.getString("type")!!);
        const name: string = args.getString("name")!!;
        const status = args.getString("status")!! as ClientPresenceStatus;

        interaction.client.user?.setPresence({ activities: [{ type, name }], status });

        await Presence.updateOne({}, { type, name, status }, { upsert: true });

        await interaction.reply({ content: `> Client presence set to "**${ActivityType[type]} ${name}**" (${status})` });
    },
} as CommandObject;