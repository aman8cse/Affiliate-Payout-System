import { Router } from "express";
import { createSale, getSales, getSaleById, confirmSale, rejectSale } from "../controllers/saleController.js";

const router = Router();

router.post("/", createSale);
router.get("/", getSales);
router.get("/:saleId", getSaleById);

//admin routes, will later be gaurded by Role Based Access and Authentication
router.post("/:saleId/confirm", confirmSale);
router.post("/:saleId/reject", rejectSale);

export default router;