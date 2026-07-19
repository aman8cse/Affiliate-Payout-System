import mongoose from "mongoose";

const walletSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
            index: true,
        },

        balance: {
            type: Number,
            default: 0,
        },

        lifetimeEarnings: {
            type: Number,
            default: 0,
        },

        totalWithdrawn: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

const Wallet = mongoose.model("Wallet", walletSchema);

export default Wallet;