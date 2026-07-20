import { Router } from "express";
import { getWallet, getWalletTransactions } from "../controllers/walletController.js";

const router = Router();

//user routes will later be gaurded by authentication
router.get("/:userId", getWallet);
router.get("/:userId/transactions", getWalletTransactions);

export default router;