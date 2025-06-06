import express from "express";
import {
  atualizarDadosFuncionarioController,
  excluirFuncionarioController,
  listarFuncionarioController,
  listarFuncionariosController,
  regitrarFuncionarioController,
} from "../controllers/funcionarioController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
import {
  somenteAdmin,
  somenteAdminSupervisor,
} from "../middlewares/nivelAcessoMiddleware.js";

export const funcionarioRoutes = express.Router();

// Protegido e restrito a admin/supervisor
funcionarioRoutes.post(
  "/funcionarios",
  verifyToken,
  somenteAdminSupervisor,
  regitrarFuncionarioController
);
funcionarioRoutes.get(
  "/funcionarios",
  verifyToken,
  somenteAdminSupervisor,
  listarFuncionariosController
);
funcionarioRoutes.get(
  "/funcionarios/:matricula",
  verifyToken,
  somenteAdminSupervisor,
  listarFuncionarioController
);
// Protegido e restrito a admin
funcionarioRoutes.delete(
  "/funcionarios/:matricula",
  verifyToken,
  somenteAdmin,
  excluirFuncionarioController
);
funcionarioRoutes.put(
  "/funcionarios/:matricula",
  verifyToken,
  somenteAdmin,
  atualizarDadosFuncionarioController
);
