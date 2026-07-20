import Transaction from "../models/Transaction.js";

class TransactionService {

    //create a new wallet whenever a user is created, it's binded with user service
    async create({
        walletId,
        type,
        amount,
        balanceAfter,
        referenceType,
        referenceId,
        remarks = "",
        session = null
    }) {
        return Transaction.create([
            {
                wallet: walletId,
                type,
                amount,
                balanceAfter,
                referenceType,
                referenceId,
                remarks
            }
        ], { session });
    }

    //get all transactions in a wallet
    async getWalletTransactions(walletId) {
        return Transaction.find({ wallet: walletId }).sort({ createdAt: -1 });
    }
}

export default new TransactionService();