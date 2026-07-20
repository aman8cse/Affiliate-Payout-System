import Wallet from "../models/Wallet.js";
import ApiError from "../utils/ApiError.js";

class WalletService {

    //get wallet by user id
    async getWallet(userId, session = null) {
        const wallet = await Wallet.findOne({
            user: userId
        }).session(session);

        if (!wallet) {
            throw new ApiError(404, "Wallet not found");
        }

        return wallet;
    }


    //credit amount in wallet
    async credit(userId, amount, session = null) {
        const wallet = await this.getWallet(userId, session);

        wallet.balance += amount;
        wallet.lifetimeEarnings += amount;

        await wallet.save({ session });

        return wallet;
    }

    //debit amount from wallet
    async debit(userId, amount, session = null) {
        const wallet = await this.getWallet(userId, session);

        wallet.balance -= amount;

        await wallet.save({ session });

        return wallet;
    }
}

export default new WalletService();