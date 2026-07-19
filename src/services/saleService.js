import Sale from "../models/Sale.js";
import User from "../models/User.js";
import ApiError from "../utils/ApiError.js";
import env from "../config/env.js";

class SaleService {

    async createSale({ userId, commissionAmount }) {
        const user = await User.findById(userId);

        if (!user) {
            throw new ApiError(404, "User not found");
        }

        const advanceAmount = Math.floor(
            commissionAmount * env.ADVANCE_PERCENTAGE / 100
        );

        const sale = await Sale.create({
            user: userId,
            commissionAmount,
            advanceAmount,
            finalAmount: null,
            status: "PENDING",
            advancePaid: false,
            finalPaid: false
        });

        return sale;
    }

    async getSales() {

        return Sale.find()
            .populate("user", "name email")
            .sort({
                createdAt: -1
            });

    }

    async getSaleById(id) {
        const sale = await Sale.findById(id)
            .populate("user", "name email");

        if (!sale) {
            throw new ApiError(404, "Sale not found");
        }

        return sale;

    }

    async confirmSale(saleId) {
        const sale = await Sale.findById(saleId);

        if (!sale) {
            throw new ApiError(404, "Sale not found");
        }

        if (sale.status !== "PENDING") {
            throw new ApiError(
                400,
                "Sale already reconciled"
            );
        }

        sale.status = "CONFIRMED";

        sale.finalAmount =
            sale.commissionAmount -
            sale.advanceAmount;

        await sale.save();

        return sale;

    }

    async rejectSale(saleId) {
        const sale = await Sale.findById(saleId);

        if (!sale) {
            throw new ApiError(404, "Sale not found");
        }

        if (sale.status !== "PENDING") {
            throw new ApiError(
                400,
                "Sale already reconciled"
            );
        }

        sale.status = "REJECTED";

        sale.finalAmount =
            -sale.advanceAmount;

        await sale.save();

        return sale;
    }
}

export default new SaleService();