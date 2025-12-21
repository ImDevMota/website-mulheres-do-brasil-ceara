import { Router } from "express";
import { login, getMe } from "../controllers/AuthController.js";

import { verifyToken } from "../middlewares/authMiddleware.js";
const router = Router();

router.post("/", login);
router.get("/me", verifyToken, getMe);

export default router;
