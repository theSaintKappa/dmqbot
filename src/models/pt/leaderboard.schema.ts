import { Schema, model } from "mongoose";
import type { ILeaderboard } from "../../db";

const schema = new Schema<ILeaderboard>(
    {
        userId: { type: String, required: true },
        count: { type: Number, required: true },
    },
    { timestamps: true, versionKey: false },
);

export default model<ILeaderboard>("pt.leaderboard", schema, "pt.leaderboard");
