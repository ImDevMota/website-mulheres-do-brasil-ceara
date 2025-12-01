import { Router } from "express";
import {
  listarRodas,
  criarRoda,
  listarRodasMultiplicador,
  encerrarRoda,
} from "../controllers/rodaController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const rodaRoutes = Router();

rodaRoutes.post("/", verifyToken, criarRoda);
rodaRoutes.get("/", listarRodas);
rodaRoutes.get("/multiplicador", verifyToken, listarRodasMultiplicador);
rodaRoutes.get("/encerrar", verifyToken, encerrarRoda);

export default rodaRoutes;
