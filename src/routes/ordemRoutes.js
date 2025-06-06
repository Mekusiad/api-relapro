import express from "express";

import { verifyToken } from "../middlewares/authMiddleware.js";

import {
  listarOrdemController,
  atualizarOrdemController,
  novaOrdemController,
  adicionarComponenteController,
  atualizarComponenteController,
} from "../controllers/ordemController.js";
import { somenteAdminSupervisor } from "../middlewares/nivelAcessoMiddleware.js";

export const ordemRoutes = express.Router();

ordemRoutes.post(
  "/ordens",
  verifyToken,
  somenteAdminSupervisor,
  novaOrdemController
);
ordemRoutes.put("/ordens/:numeroOs", verifyToken, atualizarOrdemController);

// Componentes
ordemRoutes.post(
  "/ordens/:numeroOs/componentes",
  verifyToken,
  adicionarComponenteController
);
ordemRoutes.put(
  "/ordens/:numeroOs/componentes/:numeroSerie",
  verifyToken,
  atualizarComponenteController
);

// Listagem
ordemRoutes.get("/ordens", verifyToken, listarOrdemController);
