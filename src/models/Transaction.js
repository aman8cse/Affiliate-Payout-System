import mongoose from "mongoose";
import { TRANSACTION_TYPE } from "../utils/constants.js";

const transactionSchema = new mongoose.Schema(
    {
        wallet: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Wallet",
            required: true,
            index: true,
        },

        type: {
            type: String,
            enum: Object.values(TRANSACTION_TYPE),
            required: true,
            index: true,
        },

        amount: {
            type: Number,
            required: true,
        },

        balanceAfter: {
            type: Number,
            required: true,
        },

        referenceType: {
            type: String,
            enum: ["SALE", "WITHDRAWAL"],
            required: true,
        },

        referenceId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },

        remarks: {
            type: String,
            trim: true,
            default: "",
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

transactionSchema.index({
    wallet: 1,
    createdAt: -1,
});

transactionSchema.index({
    referenceType: 1,
    referenceId: 1,
});

const Transaction = mongoose.model("Transaction", transactionSchema);

export default Transaction;