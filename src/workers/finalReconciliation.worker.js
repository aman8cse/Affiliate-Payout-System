import mongoose from "mongoose";
import { Worker } from "bullmq";

import redis from "../config/redis.js";
import logger from "../config/logger.js";

import Sale from "../models/Sale.js";

import walletService from "../services/walletService.js";
import transactionService from "../services/transactionService.js";

import { TRANSACTION_TYPE } from "../utils/constants.js";

const worker = new Worker(
    "final-reconciliation",
    async () => {
        const sales = await Sale.find({
            status: {
                $in: ["CONFIRMED", "REJECTED"]
            },
            finalPaid: false
        }).sort({
            createdAt: 1
        });

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

                let totalAmount = 0;

                for (const sale of userSales) {
                    totalAmount += sale.finalAmount;
                }

                const wallet = await walletService.getWallet(
                    userId,
                    session
                );

                const oldBalance = wallet.balance;

                if (totalAmount >= 0) {
                    await walletService.credit(
                        userId,
                        totalAmount,
                        session
                    );
                } else {
                    await walletService.debit(
                        userId,
                        Math.abs(totalAmount),
                        session
                    );
                }

                let runningBalance = oldBalance;

                for (const sale of userSales) {
                    runningBalance += sale.finalAmount;
                    await transactionService.create({
                        walletId: wallet._id,
                        type:
                            sale.finalAmount >= 0
                                ? TRANSACTION_TYPE.FINAL_CREDIT
                                : TRANSACTION_TYPE.FINAL_DEBIT,
                        amount: Math.abs(sale.finalAmount),
                        balanceAfter: runningBalance,
                        referenceType: "SALE",
                        referenceId: sale._id,
                        remarks:
                            sale.status === "CONFIRMED"
                                ? "Final commission"
                                : "Advance recovery",
                        session
                    });
                }

                await Sale.updateMany(
                    {
                        _id: {
                            $in: userSales.map(
                                sale => sale._id
                            )
                        }
                    },
                    {
                        $set: {
                            finalPaid: true
                        }
                    },
                    {
                        session
                    }
                );

                await session.commitTransaction();
            }

            catch (error) {
                await session.abortTransaction();
                logger.error(error);
            }

            finally {
                session.endSession();
            }

        }
    },
    {
        connection: redis
    }
);

export default worker;