import mongoose from "mongoose";
import { Worker } from "bullmq";

import redis from "../config/redis.js";
import logger from "../config/logger.js";
import Withdrawal from "../models/Withdrawal.js";
import walletService from "../services/walletService.js";
import transactionService from "../services/transactionService.js";
import paymentGatewayService from "../services/paymentGatewayService.js";
import { TRANSACTION_TYPE, WITHDRAWAL_STATUS } from "../utils/constants.js";

const worker = new Worker(
    "withdrawal",
    async (job) => {
        const { withdrawalId } = job.data;

        //creating mongoose session to prevent partial updates and follow ACID priciples
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

            //debit wallet before payment gateway as per assignment requirement to build a feature to reverse payment in case payment failed, but
            //a real world alternative would be to process gateway first to remove refund overhead in case of failure
            let wallet = await walletService.debit(
                withdrawal.user,
                withdrawal.amount,
                session
            );

            //created ledger entry for processing withdrawal
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

            const { success } = await paymentGatewayService.transfer();

            if (success) {
                withdrawal.status = WITHDRAWAL_STATUS.SUCCESS;
            } else {
                //refund amound in case the payment gateway failed the transaction
                wallet = await walletService.credit(
                    withdrawal.user,
                    withdrawal.amount,
                    session
                );

                //created a new ledger entry for refund of the same withdrawal
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