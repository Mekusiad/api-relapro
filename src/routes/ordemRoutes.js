import express from "express";

import { verifyToken } from "../middlewares/authMiddleware.js";

import {
  listarOrdemController,
  novaOrdem,
  atualizarOrdemController,
} from "../controllers/ordemController.js";
import { listarServicos } from "../services/ordemServices.js";
import { nivelAcessoMiddleware } from "../middlewares/nivelAcessoMiddleware.js";

export const orderRouter = express.Router();

orderRouter.post("/new-order", verifyToken, novaOrdem);
orderRouter.post("/:numeroOs", verifyToken, listarOrdemController);

orderRouter.get(
  "/ordens/",
  verifyToken,
  nivelAcessoMiddleware(["ADMIN,SUPERVISOR"]),
  listarServicos
);
orderRouter.get(
  "/listar-ordem/:numeroOs",
  verifyToken,
  atualizarOrdemController
);
