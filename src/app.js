import cors from "cors";
import express from "express";

import requestId from "./middleware/requestId.js";
import { generalLimiter } from "./middleware/rateLimiter.js";
import errorHandler from "./middleware/errorHandler.js";

import userRoutes from "./routes/user.routes.js";
import saleRoutes from "./routes/sale.routes.js";
import walletRoutes from "./routes/wallet.routes.js";
import withdrawalRoutes from "./routes/withdrawal.routes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(requestId);
app.use(generalLimiter);

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Affiliate Payout API Running"
    });
});

app.use("/api/users", userRoutes);
app.use("/api/sales", saleRoutes);
app.use("/api/wallet", walletRoutes);
app.use("/api/withdrawals", withdrawalRoutes);

app.use(errorHandler);

export default app;