import asyncHandler from "../middleware/asyncHandler.js";

import withdrawalService from "../services/withdrawalService.js";

import ApiResponse from "../utils/ApiResponse.js";

export const requestWithdrawal = asyncHandler(async (req, res) => {

    const { userId, amount } = req.body;

    if (!userId || !amount) {
        return res.status(400).json({
            success: false,
            message: "userId and amount are required"
        });
    }

    const withdrawal =
        await withdrawalService.requestWithdrawal({

            userId,

            amount

        });

    res.status(201).json(
        new ApiResponse(
            201,
            "Withdrawal request created",
            withdrawal
        )
    );

});

export const getUserWithdrawals = asyncHandler(async (req, res) => {

    const withdrawals =
        await withdrawalService.getUserWithdrawals(
            req.params.userId
        );

    res.status(200).json(
        new ApiResponse(
            200,
            "Withdrawals fetched successfully",
            withdrawals
        )
    );

});