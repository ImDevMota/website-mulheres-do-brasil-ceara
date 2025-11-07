import { Router } from "express";
import { criarRoda } from "../controllers/rodaController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = Router();
router.post("/", verifyToken, criarRoda);

export default router;
