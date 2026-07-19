import mongoose from "mongoose";
import { SALE_STATUS } from "../utils/constants.js";

const saleSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        commissionAmount: {
            type: Number,
            required: true,
            min: 0,
        },

        advanceAmount: {
            type: Number,
            required: true,
            min: 0,
        },

        finalAmount: {
            type: Number,
            default: null,
        },

        status: {
            type: String,
            enum: Object.values(SALE_STATUS),
            default: SALE_STATUS.PENDING,
            index: true,
        },

        advancePaid: {
            type: Boolean,
            default: false,
            index: true,
        },

        finalPaid: {
            type: Boolean,
            default: false,
            index: true,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

saleSchema.index({
    status: 1,
    advancePaid: 1,
});

saleSchema.index({
    status: 1,
    finalPaid: 1,
});

saleSchema.index({
    user: 1,
    createdAt: -1,
});

const Sale = mongoose.model("Sale", saleSchema);

export default Sale;