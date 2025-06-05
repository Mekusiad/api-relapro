import express from "express";
import {
  listarFuncionariosController,
  regitrarFuncionarioController,
} from "../controllers/funcionarioController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

export const funcionarioRouter = express.Router();

funcionarioRouter.post("/registrar", regitrarFuncionarioController);

funcionarioRouter.get(
  "/listar-todos",
  verifyToken,
  listarFuncionariosController
);
