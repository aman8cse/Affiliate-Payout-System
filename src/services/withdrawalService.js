import mongoose from "mongoose";
import User from "../models/User.js";
import Wallet from "../models/Wallet.js";
import Withdrawal from "../models/Withdrawal.js";
import withdrawalQueue from "../queues/withdrawal.queue.js";
import walletService from "./walletService.js";
import ApiError from "../utils/ApiError.js";
import { WITHDRAWAL_STATUS, TRANSACTION_TYPE } from "../utils/constants.js";

class WithdrawalService {

    async requestWithdrawal({ userId, amount }) {

        const user = await User.findById(userId);

        if (!user) {
            throw new ApiError(404, "User not found");
        }

        const wallet = await Wallet.findOne({
            user: userId
        });

        if (!wallet) {
            throw new ApiError(404, "Wallet not found");
        }

        if (wallet.balance < amount) {
            throw new ApiError(400, "Insufficient wallet balance");
        }

        const withdrawal = await Withdrawal.create({

            user: userId,

            amount,

            status: WITHDRAWAL_STATUS.PENDING

        });

        await withdrawalQueue.add(

            "withdrawal",

            {

                withdrawalId: withdrawal._id

            }

        );

        return withdrawal;

    }

    async getUserWithdrawals(userId) {

        return await Withdrawal.find({

            user: userId

        }).sort({

            createdAt: -1

        });

    }

}

export default new WithdrawalService();