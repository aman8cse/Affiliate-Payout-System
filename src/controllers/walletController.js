import asyncHandler from "../middleware/asyncHandler.js";

import walletService from "../services/walletService.js";
import transactionService from "../services/transactionService.js";

import ApiResponse from "../utils/ApiResponse.js";

export const getWallet = asyncHandler(async (req, res) => {

    const wallet = await walletService.getWallet(
        req.params.userId
    );

    res.status(200).json(
        new ApiResponse(
            200,
            "Wallet fetched successfully",
            wallet
        )
    );

});

export const getWalletTransactions = asyncHandler(async (req, res) => {

    const wallet = await walletService.getWallet(
        req.params.userId
    );

    const transactions =
        await transactionService.getWalletTransactions(
            wallet._id
        );

    res.status(200).json(
        new ApiResponse(
            200,
            "Transactions fetched successfully",
            transactions
        )
    );

});