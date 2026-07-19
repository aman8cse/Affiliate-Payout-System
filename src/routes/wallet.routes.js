import { Router } from "express";
import { getWallet, getWalletTransactions } from "../controllers/walletController.js";

const router = Router();

router.get("/:userId", getWallet);
router.get("/:userId/transactions", getWalletTransactions);

export default router;