import express from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import {
  homeInfoController,
  homeListarComponentesDaOrdemController,
  homeDetalharOrdemFuncionarioController,
  homeListarFuncionarioController,
  homeListarOrdensDoFuncionarioController,
  homeBuscarFuncionarioPorMatriculaController,
  homeAtualizarOrdemController,
  homeAdicionarComponenteController,
  homeAtualizarComponenteController,
  homeRegistrarFuncionarioController,
  homeAtualizadosDadosFuncionarioController,
  homeExcluirFuncionarioController,
  homeCriarOsController,
  homeAdicionarEnsaioComponenteController,
  homeExcluirOsController,
  homeListarLogsController,
  homeExcluirEnsaioComponenteController,
  homeExcluirComponenteController,
} from "../controllers/homeController.js";

export const homeRoutes = express.Router();

// Middleware global de autenticação
homeRoutes.use(verifyToken);

// GET /home -> Página inicial
homeRoutes.get("/home", homeInfoController);

// POST /home/:matricula/funcionarios -> Criar funcionário
homeRoutes.post(
  "/home/:matricula/funcionarios",
  homeRegistrarFuncionarioController
);

// PUT /home/:matricula/funcionarios/:outraMatricula -> Atualiza dados de outro funcionário
homeRoutes.put(
  "/home/:matricula/funcionarios/:outraMatricula",
  homeAtualizadosDadosFuncionarioController
);

// DELETE /home/:matricula/funcionarios/:outraMatricula -> Excluir funcionário
homeRoutes.delete(
  "/home/:matricula/funcionarios/:outraMatricula",
  homeExcluirFuncionarioController
);

// GET /home/:matricula/funcionarios → lista todos os funcionários (admin/supervisor)
homeRoutes.get(
  "/home/:matricula/funcionarios",
  homeListarFuncionarioController
);

// GET /home/:matricula/funcionarios/:outraMatricula → busca funcionário específico
homeRoutes.get(
  "/home/:matricula/funcionarios/:outraMatricula",
  homeBuscarFuncionarioPorMatriculaController
);

// POST /home/:matricual/ordens -> Criar OS
homeRoutes.post("/home/:matricula/ordens", homeCriarOsController);

// DELETE /home/:admin/ordens/:numeroOs -> Excluir OS
homeRoutes.delete("/home/:matricula/ordens/:numeroOs", homeExcluirOsController);

// PUT /home/:matricula/ordens/:numeroOs -> Atualiza ordem(add/remove técnico, troca supervisor, atualiza status)
homeRoutes.put(
  "/home/:matricula/ordens/:numeroOs",
  homeAtualizarOrdemController
);

// GET /home/:matricula/ordens → lista todas as ordens da pessoa
homeRoutes.get(
  "/home/:matricula/ordens",
  homeListarOrdensDoFuncionarioController
);

// GET /home/:matricula/ordens/:numeroOs → detalhes da ordem
homeRoutes.get(
  "/home/:matricula/ordens/:numeroOs",
  homeDetalharOrdemFuncionarioController
);

// POST /home/:matricula/ordens/:numeroOs/componentes -> Adiciona um componente na OS.
homeRoutes.post(
  "/home/:matricula/ordens/:numeroOs/componentes",
  homeAdicionarComponenteController
);

// PUT /home/:matricula/ordens/:numeroOs/componentes/:componenteId -> Atualiza dados do componente
homeRoutes.put(
  "/home/:matricula/ordens/:numeroOs/componentes/:componenteId",
  homeAtualizarComponenteController
);

//DELETE /home/:matricula/ordens/:numeroOs/componentes/:componenteId -> Exclui componente da OS
homeRoutes.delete(
  "/home/:matricula/ordens/:numeroOs/componentes/:componenteId",
  homeExcluirComponenteController
);

// GET /home/:matricula/ordens/:numeroOs/componentes → Consulta componentes da OS
homeRoutes.get(
  "/home/:matricula/ordens/:numeroOs/componentes",
  homeListarComponentesDaOrdemController
);

// POST /home/:matricula/ordens/:numeroOs/componentes/:componenteId/ensaio -> Adiciona ensaio ao componente
homeRoutes.post(
  "/home/:matricula/ordens/:numeroOs/componentes/:componenteId/ensaio",
  homeAdicionarEnsaioComponenteController
);

// DELETE /home/:matricula/ordens/:numeroOs/componentes/:componenteId/ensaio/:ensaioId -> Excluir ensaio do componente
homeRoutes.delete(
  "/home/:matricula/ordens/:numeroOs/componentes/:componenteId/ensaio/:ensaioId",
  homeExcluirEnsaioComponenteController
);

// GET /home/:matricula/logs
homeRoutes.get("/home/:matricula/logs", homeListarLogsController);
