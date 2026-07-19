import Transaction from "../models/Transaction.js";

class TransactionService {
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

    async getWalletTransactions(walletId) {
        return Transaction.find({ wallet: walletId }).sort({ createdAt: -1 });
    }
}

export default new TransactionService();