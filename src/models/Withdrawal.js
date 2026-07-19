import mongoose from "mongoose";
import { WITHDRAWAL_STATUS } from "../utils/constants.js";

const withdrawalSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        amount: {
            type: Number,
            required: true,
            min: 1,
        },

        status: {
            type: String,
            enum: Object.values(WITHDRAWAL_STATUS),
            default: WITHDRAWAL_STATUS.PENDING,
            index: true,
        },

        processedAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

withdrawalSchema.index({
    wallet: 1,
    createdAt: -1,
});

const Withdrawal = mongoose.model("Withdrawal", withdrawalSchema);

export default Withdrawal;