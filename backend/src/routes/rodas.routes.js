import { Router } from "express";
import { listarRodas, criarRoda } from "../controllers/rodaController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const rodaRoutes = Router();

rodaRoutes.post("/", verifyToken, criarRoda);
rodaRoutes.get("/", listarRodas);

export default rodaRoutes;
