import { Router } from "express";
import { requestWithdrawal, getUserWithdrawals } from "../controllers/withdrawalController.js";
import { withdrawLimiter } from "../middleware/rateLimiter.js";

const router = Router();

router.post("/", withdrawLimiter, requestWithdrawal);
router.get("/:userId", getUserWithdrawals);

export default router;