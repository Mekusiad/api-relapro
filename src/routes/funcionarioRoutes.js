import express from "express";
import {
  listarFuncionarioController,
  listarFuncionariosController,
  regitrarFuncionarioController,
} from "../controllers/funcionarioController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { nivelAcessoMiddleware } from "../middlewares/nivelAcessoMiddleware.js";

export const funcionarioRouter = express.Router();

funcionarioRouter.post("/registrar", regitrarFuncionarioController);

funcionarioRouter.get(
  "/listar-todos",
  verifyToken,
  listarFuncionariosController
);

funcionarioRouter.get("/:matricula", verifyToken, listarFuncionarioController);
