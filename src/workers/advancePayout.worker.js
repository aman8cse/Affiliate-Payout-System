import mongoose from "mongoose";
import { Worker } from "bullmq";

import redis from "../config/redis.js";
import Sale from "../models/Sale.js";
import walletService from "../services/walletService.js";
import transactionService from "../services/transactionService.js";
import { TRANSACTION_TYPE } from "../utils/constants.js";

const worker = new Worker(
    "advance-payout",
    async () => {
        const sales = await Sale.find({
            status: "PENDING",
            advancePaid: false
        }).sort({ createdAt: 1 });

        const groupedSales = new Map();

        for (const sale of sales) {
            const key = sale.user.toString();

            if (!groupedSales.has(key)) {
                groupedSales.set(key, []);
            }

            groupedSales.get(key).push(sale);
        }

        for (const [userId, userSales] of groupedSales) {
            const session = await mongoose.startSession();

            try {
                session.startTransaction();

                let totalAdvance = 0;

                for (const sale of userSales) {
                    totalAdvance += sale.advanceAmount;
                }

                const wallet = await walletService.credit(userId, totalAdvance, session);
                let runningBalance = wallet.balance - totalAdvance;

                for (const sale of userSales) {
                    runningBalance += sale.advanceAmount;

                    await transactionService.create({
                        walletId: wallet._id,
                        type: TRANSACTION_TYPE.ADVANCE_CREDIT,
                        amount: sale.advanceAmount,
                        balanceAfter: runningBalance,
                        referenceType: "SALE",
                        referenceId: sale._id,
                        remarks: "Advance payout",
                        session
                    });
                }

                await Sale.updateMany(
                    {
                        _id: {
                            $in: userSales.map((sale) => sale._id)
                        }
                    },
                    {
                        $set: {
                            advancePaid: true
                        }
                    },
                    {
                        session
                    }
                );

                await session.commitTransaction();
            } catch (error) {
                await session.abortTransaction();
                console.error(error);
            } finally {
                session.endSession();
            }
        }
    },
    {
        connection: redis
    }
);

export default worker;