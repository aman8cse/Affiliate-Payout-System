import env from "../config/env.js";
import Sale from "../models/Sale.js";
import User from "../models/User.js";
import ApiError from "../utils/ApiError.js";

class SaleService {

    //creating a new sale
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

    //fetching all sales, used for batch payment jobs
    async getSales() {
        return Sale.find()
            .populate("user", "name email")
            .sort({ createdAt: -1 });
    }

    //get a sale with id
    async getSaleById(id) {
        const sale = await Sale.findById(id).populate("user", "name email");

        if (!sale) {
            throw new ApiError(404, "Sale not found");
        }

        return sale;
    }

    //used by admin to confirm a sale, final payment batch job will handle payments without any intersection with this service
    async confirmSale(saleId) {
        const sale = await Sale.findById(saleId);

        if (!sale) {
            throw new ApiError(404, "Sale not found");
        }

        if (sale.status !== "PENDING") {
            throw new ApiError(400, "Sale already reconciled");
        }

        sale.status = "CONFIRMED";
        sale.finalAmount = sale.commissionAmount - sale.advanceAmount;

        await sale.save();

        return sale;
    }

    //admin can use to reject a sale, not bound with batch payment, again modularity with separation of concerns
    async rejectSale(saleId) {
        const sale = await Sale.findById(saleId);

        if (!sale) {
            throw new ApiError(404, "Sale not found");
        }

        if (sale.status !== "PENDING") {
            throw new ApiError(400, "Sale already reconciled");
        }

        sale.status = "REJECTED";
        sale.finalAmount = -sale.advanceAmount;

        await sale.save();

        return sale;
    }
}

export default new SaleService();