import { Router } from "express";
import { createUser, getUserById } from "../controllers/userController.js";

const router = Router();

router.post("/", createUser);
router.get("/:userId", getUserById);

export default router;