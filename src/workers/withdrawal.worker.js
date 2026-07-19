import mongoose from "mongoose";
import { Worker } from "bullmq";
import redis from "../config/redis.js";
import logger from "../config/logger.js";
import env from "../config/env.js";
import Withdrawal from "../models/Withdrawal.js";
import walletService from "../services/walletService.js";
import transactionService from "../services/transactionService.js";
import paymentGatewayService from "../services/paymentGatewayService.js";
import {TRANSACTION_TYPE, WITHDRAWAL_STATUS} from "../utils/constants.js";

const worker = new Worker(
    "withdrawal",
    async job => {
        const { withdrawalId } = job.data;

        const session = await mongoose.startSession();

        try {
            session.startTransaction();

            const withdrawal = await Withdrawal.findById(withdrawalId).session(session);

            if (!withdrawal) {
                throw new Error("Withdrawal not found");
            }

            if (withdrawal.status !== WITHDRAWAL_STATUS.PENDING) {
                await session.abortTransaction();
                return;
            }

            withdrawal.status = WITHDRAWAL_STATUS.PROCESSING;
            await withdrawal.save({ session });

            let wallet = await walletService.debit(
                withdrawal.user,
                withdrawal.amount,
                session
            );

            await transactionService.create({
                walletId: wallet._id,
                type: TRANSACTION_TYPE.WITHDRAWAL,
                amount: withdrawal.amount,
                balanceAfter: wallet.balance,
                referenceType: "WITHDRAWAL",
                referenceId: withdrawal._id,
                remarks: "Withdrawal",
                session
            });

            /*
                Simulate Payment Gateway
            */

            const { success } = await paymentGatewayService.transfer();

            if (success) {
                withdrawal.status = WITHDRAWAL_STATUS.SUCCESS;
            } else {
                wallet = await walletService.credit(
                    withdrawal.user,
                    withdrawal.amount,
                    session
                );

                await transactionService.create({
                    walletId: wallet._id,
                    type: TRANSACTION_TYPE.WITHDRAWAL_REFUND,
                    amount: withdrawal.amount,
                    balanceAfter: wallet.balance,
                    referenceType: "WITHDRAWAL",
                    referenceId: withdrawal._id,
                    remarks: "Refund for failed withdrawal",
                    session
                });

                withdrawal.status = WITHDRAWAL_STATUS.FAILED;
            }

            withdrawal.processedAt = new Date();

            await withdrawal.save({ session });

            await session.commitTransaction();

        } catch (error) {
            await session.abortTransaction();
            logger.error(error);

        } finally {
            session.endSession();
        }

    },
    {
        connection: redis
    }
);

export default worker;