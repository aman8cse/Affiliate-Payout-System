import env from "../config/env.js";
import Wallet from "../models/Wallet.js";
import Withdrawal from "../models/Withdrawal.js";
import withdrawalQueue from "../queues/withdrawal.queue.js";
import ApiError from "../utils/ApiError.js";
import { WITHDRAWAL_STATUS } from "../utils/constants.js";

class WithdrawalService {
    async requestWithdrawal({ userId, amount }) {
        const wallet = await Wallet.findOne({ user: userId });

        if (!wallet) {
            throw new ApiError(404, "User/Wallet not found");
        }

        if (!amount || amount <= 0) {
            throw new ApiError(400, "Withdrawal amount must be greater than 0.");
        }

        const lastWithdrawal = await Withdrawal.findOne({
            user: userId,
            status: {
                $in: [
                    WITHDRAWAL_STATUS.PENDING,
                    WITHDRAWAL_STATUS.PROCESSING,
                    WITHDRAWAL_STATUS.SUCCESS
                ]
            }
        }).sort({ createdAt: -1 });

        if (lastWithdrawal) {
            const hoursPassed =
                (Date.now() - lastWithdrawal.createdAt.getTime()) / (1000 * 60 * 60);
            const gap = env.WITHDRAWAL_HOURS_GAP || 24;

            if (hoursPassed < 24) {
                const remainingHours = Math.ceil(24 - hoursPassed);

                throw new ApiError(
                    400,
                    `You can request another withdrawal after ${remainingHours} hour(s).`
                );
            }
        }

        if (wallet.balance < amount) {
            throw new ApiError(400, "Insufficient wallet balance");
        }

        const withdrawal = await Withdrawal.create({
            user: userId,
            amount,
            status: WITHDRAWAL_STATUS.PENDING
        });

        await withdrawalQueue.add("withdrawal", {
            withdrawalId: withdrawal._id
        });

        return withdrawal;
    }

    async getUserWithdrawals(userId) {
        return Withdrawal.find({ user: userId }).sort({ createdAt: -1 });
    }
}

export default new WithdrawalService();