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
  homeCadastrarEquipamentoController,
  homeAtualizarEquipamentoController,
  homeListarEquipamentosController,
  homeExcluirEquipamentoController,
  homeadicionarSubestacaoController,
  homeRemoverSubestacaoController,
  homeAtualizarDadosSubestaçãoController,
  homeListarSubestacaoController,
} from "../controllers/homeController.js";
import { validateReq } from "../middlewares/homeMiddleware.js";
import {
  listarSubestacaoSchema,
  adicionarSubestacaoSchema,
  atualizarDadosFuncionarioSchema,
  criarOrdemSchema,
  excluirFuncionarioSchema,
  excluirOsSchema,
  homeInfoSchema,
  listarFuncionariosSchema,
  registrarFuncionarioSchema,
  removerSubestacaoSchema,
  atualizarDadosSubestacaoSchema,
  detalharOrdemFuncionarioSchema,
} from "../validations/schema.js";
import { conferirMatriculaMiddleware } from "../middlewares/conferirMatriculaMiddleware.js";
import { conferirNivelAcessoMiddleware } from "../middlewares/conferirNivelAcessoMiddleware.js";

export const homeRoutes = express.Router();

// Middleware global de autenticação
homeRoutes.use(verifyToken);

// GET /home -> Página inicial
homeRoutes.get(
  "/home",
  validateReq(homeInfoSchema, "custom"),
  homeInfoController
);

// POST /home/:matricula/funcionarios -> Criar funcionário
homeRoutes.post(
  "/home/:matricula/funcionarios",
  conferirMatriculaMiddleware("matricula"),
  conferirNivelAcessoMiddleware("ADMIN"),
  validateReq(registrarFuncionarioSchema, "body"),
  homeRegistrarFuncionarioController
);

// PUT /home/:matricula/funcionarios/:outraMatricula -> Atualiza dados de outro funcionário
homeRoutes.put(
  "/home/:matricula/funcionarios/:outraMatricula",
  conferirMatriculaMiddleware("matricula"),
  conferirNivelAcessoMiddleware("ADMIN"),
  validateReq(atualizarDadosFuncionarioSchema, "body"),
  homeAtualizadosDadosFuncionarioController
);

// POST /home:/matricula/ordens/:numeroOs/subestacoes -> Cria subestação
homeRoutes.post(
  "/home/:matricula/ordens/:numeroOs/subestacoes",
  conferirMatriculaMiddleware("matricula"),
  conferirNivelAcessoMiddleware("ADMIN"),
  validateReq(adicionarSubestacaoSchema, "body"),
  homeadicionarSubestacaoController
);

// GET /home:/matricula/ordens/:numeroOs/subestacoes -> Listar subestação
homeRoutes.get(
  "/home/:matricula/ordens/:numeroOs/subestacoes",
  conferirMatriculaMiddleware("matricula"),
  conferirNivelAcessoMiddleware("ADMIN"),
  validateReq(listarSubestacaoSchema, "params"),
  homeListarSubestacaoController
);

// DELETE /home:/matricula/ordens/:numeroOs/subestacoes -> Exclui subestação
homeRoutes.delete(
  "/home/:matricula/ordens/:numeroOs/subestacoes/:subestacaoId",
  conferirMatriculaMiddleware("matricula"),
  conferirNivelAcessoMiddleware("ADMIN"),
  validateReq(removerSubestacaoSchema, "params"),
  homeRemoverSubestacaoController
);

// PUT /home:/matricula/ordens/:numeroOs/subestacoes -> Atualiza dados subestação
homeRoutes.put(
  "/home/:matricula/ordens/:numeroOs/subestacoes/:subestacaoId",
  conferirMatriculaMiddleware("matricula"),
  conferirNivelAcessoMiddleware("ADMIN"),
  validateReq(atualizarDadosSubestacaoSchema, "params"),
  homeAtualizarDadosSubestaçãoController
);

// DELETE /home/:matricula/funcionarios/:outraMatricula -> Excluir funcionário
homeRoutes.delete(
  "/home/:matricula/funcionarios/:outraMatricula",
  conferirMatriculaMiddleware("matricula"),
  conferirNivelAcessoMiddleware("ADMIN"),
  validateReq(excluirFuncionarioSchema, "params"),
  homeExcluirFuncionarioController
);

// GET /home/:matricula/funcionarios → lista todos os funcionários (admin/supervisor)
homeRoutes.get(
  "/home/:matricula/funcionarios",
  conferirMatriculaMiddleware("matricula"),
  conferirNivelAcessoMiddleware("ADMIN", "SUPERVISOR"),
  validateReq(listarFuncionariosSchema, "params"),
  homeListarFuncionarioController
);

// GET /home/:matricula/funcionarios/:outraMatricula → busca funcionário específico
homeRoutes.get(
  "/home/:matricula/funcionarios/:outraMatricula",
  homeBuscarFuncionarioPorMatriculaController
);

// POST /home/:matricual/ordens -> Criar OS
homeRoutes.post(
  "/home/:matricula/ordens",
  conferirMatriculaMiddleware("matricula"),
  conferirNivelAcessoMiddleware("ADMIN", "SUPERVISOR"),
  validateReq(criarOrdemSchema, "body"),
  homeCriarOsController
);

// DELETE /home/:admin/ordens/:numeroOs -> Excluir OS
homeRoutes.delete(
  "/home/:matricula/ordens/:numeroOs",
  conferirMatriculaMiddleware("matricula"),
  conferirNivelAcessoMiddleware("ADMIN"),
  validateReq(excluirOsSchema, "params"),
  homeExcluirOsController
);

// PUT /home/:matricula/ordens/:numeroOs -> Atualiza ordem(add/remove técnico, troca supervisor, atualiza status)
homeRoutes.put(
  "/home/:matricula/ordens/:numeroOs",
  conferirMatriculaMiddleware("matricula"),
  homeAtualizarOrdemController
);

// GET /home/:matricula/ordens → lista todas as ordens da pessoa
homeRoutes.get(
  "/home/:matricula/ordens",
  conferirMatriculaMiddleware("matricula"),
  homeListarOrdensDoFuncionarioController
);

// GET /home/:matricula/ordens/:numeroOs → detalhes da ordem
homeRoutes.get(
  "/home/:matricula/ordens/:numeroOs",
  conferirMatriculaMiddleware("matricula"),
  validateReq(detalharOrdemFuncionarioSchema, "params"),
  homeDetalharOrdemFuncionarioController
);

// POST /home/:matricula/ordens/:numeroOs/componentes -> Adiciona um componente na OS.
homeRoutes.post(
  "/home/:matricula/ordens/:numeroOs/subestacoes/:subestacaoId/componentes",
  homeAdicionarComponenteController
);

// PUT /home/:matricula/ordens/:numeroOs/componentes/:componenteId -> Atualiza dados do componente
homeRoutes.put(
  "/home/:matricula/ordens/:numeroOs/subestacoes/:subestacaoId/componentes/:componenteId",
  homeAtualizarComponenteController
);

//DELETE /home/:matricula/ordens/:numeroOs/componentes/:componenteId -> Exclui componente da OS
homeRoutes.delete(
  "/home/:matricula/ordens/:numeroOs/subestacoes/:subestacaoId/componentes/:componenteId",
  homeExcluirComponenteController
);

// GET /home/:matricula/ordens/:numeroOs/componentes → Consulta componentes da OS
homeRoutes.get(
  "/home/:matricula/ordens/:numeroOs/componentes",
  homeListarComponentesDaOrdemController
);

// POST /home/:matricula/ordens/:numeroOs/componentes/:componenteId/ensaio -> Adiciona ensaio ao componente
homeRoutes.post(
  "/home/:matricula/ordens/:numeroOs/subestacoes/:subestacaoId/componentes/:componenteId/ensaio",
  homeAdicionarEnsaioComponenteController
);

// DELETE /home/:matricula/ordens/:numeroOs/componentes/:componenteId/ensaio/:ensaioId -> Excluir ensaio do componente
homeRoutes.delete(
  "/home/:matricula/ordens/:numeroOs/subestacoes/:subestacaoId/componentes/:componenteId/ensaio/:ensaioId",
  homeExcluirEnsaioComponenteController
);

// GET /home/:matricula/logs
homeRoutes.get("/home/:matricula/logs", homeListarLogsController);

// POST /home/:matricula/equipamentos
homeRoutes.post(
  "/home/:matricula/equipamentos",
  homeCadastrarEquipamentoController
);

// PUT /home/:matricula/equipamentos/:equipamentoId
homeRoutes.put(
  "/home/:matricula/equipamentos/:equipamentoId",
  homeAtualizarEquipamentoController
);

// GET /home/:matricula/equipamentos/
homeRoutes.get(
  "/home/:matricula/equipamentos/",
  homeListarEquipamentosController
);

// DELETE /home/:matricula/equipamentos/:equipamentoId
homeRoutes.delete(
  "/home/:matricula/equipamentos/:equipamentoId",
  homeExcluirEquipamentoController
);
