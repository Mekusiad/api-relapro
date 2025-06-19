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
import {
  validarEnsaioMiddleware,
  validateGenerico,
  validateReq,
} from "../middlewares/homeMiddleware.js";
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
  listarComponentesDaSubestacaoSchema,
  buscarFuncionarioPorMatriculaSchema,
  adicionarComponenteSchema,
  atualizarComponenteSchema,
  excluirComponenteSchema,
  cadastrarEquipamentoSchema,
  atualizarEquipamentoSchema,
  removerEquipamentoSchema,
  listarEquipamentosSchema,
  schemasPorTipo,
  ensaioSchema,
} from "../validations/schema.js";
import { conferirMatriculaMiddleware } from "../middlewares/conferirMatriculaMiddleware.js";
import { conferirNivelAcessoMiddleware } from "../middlewares/conferirNivelAcessoMiddleware.js";
import { verificarRelacionamentoMiddleware } from "../middlewares/validarRelaciomentoParamsMiddleware.js";

export const homeRoutes = express.Router();

// Middleware global de autenticação
homeRoutes.use(verifyToken);

// GET -> Página inicial
homeRoutes.get(
  "/home",
  validateReq(homeInfoSchema, "custom"),
  homeInfoController
);

// POST -> Cria funcionário
homeRoutes.post(
  "/home/:matricula/funcionarios",
  conferirMatriculaMiddleware("matricula"),
  conferirNivelAcessoMiddleware("ADMIN"),
  validateReq(registrarFuncionarioSchema, "body"),
  homeRegistrarFuncionarioController
);

// PUT -> Atualiza dados de outro funcionário
homeRoutes.put(
  "/home/:matricula/funcionarios/:outraMatricula",
  conferirMatriculaMiddleware("matricula"),
  conferirNivelAcessoMiddleware("ADMIN"),
  validateReq(atualizarDadosFuncionarioSchema, "body"),
  homeAtualizadosDadosFuncionarioController
);
// DELETE -> Exclui funcionário
homeRoutes.delete(
  "/home/:matricula/funcionarios/:outraMatricula",
  conferirMatriculaMiddleware("matricula"),
  conferirNivelAcessoMiddleware("ADMIN"),
  validateReq(excluirFuncionarioSchema, "params"),
  homeExcluirFuncionarioController
);

// GET -> Lista todos os funcionários (admin/supervisor)
homeRoutes.get(
  "/home/:matricula/funcionarios",
  conferirMatriculaMiddleware("matricula"),
  conferirNivelAcessoMiddleware("ADMIN", "SUPERVISOR"),
  validateReq(listarFuncionariosSchema, "params"),
  homeListarFuncionarioController
);

// GET -> busca funcionário específico
homeRoutes.get(
  "/home/:matricula/funcionarios/:outraMatricula",
  conferirMatriculaMiddleware("matricula"),
  conferirNivelAcessoMiddleware("ADMIN", "SUPERVISOR"),
  validateReq(buscarFuncionarioPorMatriculaSchema, "params"),
  homeBuscarFuncionarioPorMatriculaController
);

// POST -> Cria subestação
homeRoutes.post(
  "/home/:matricula/ordens/:numeroOs/subestacoes",
  conferirMatriculaMiddleware("matricula"),
  conferirNivelAcessoMiddleware("ADMIN"),
  validateReq(adicionarSubestacaoSchema, "params"),
  homeadicionarSubestacaoController
);

// GET -> Lista subestação
homeRoutes.get(
  "/home/:matricula/ordens/:numeroOs/subestacoes",
  conferirMatriculaMiddleware("matricula"),
  conferirNivelAcessoMiddleware("ADMIN"),
  validateReq(listarSubestacaoSchema, "params"),
  homeListarSubestacaoController
);

// DELETE -> Exclui subestação
homeRoutes.delete(
  "/home/:matricula/ordens/:numeroOs/subestacoes/:subestacaoId",
  conferirMatriculaMiddleware("matricula"),
  conferirNivelAcessoMiddleware("ADMIN"),
  validateReq(removerSubestacaoSchema, "params"),
  homeRemoverSubestacaoController
);

// PUT -> Atualiza dados subestação
homeRoutes.put(
  "/home/:matricula/ordens/:numeroOs/subestacoes/:subestacaoId",
  conferirMatriculaMiddleware("matricula"),
  conferirNivelAcessoMiddleware("ADMIN"),
  validateReq(atualizarDadosSubestacaoSchema, "params"),
  homeAtualizarDadosSubestaçãoController
);

// POST -> Cria ordem de serviço
homeRoutes.post(
  "/home/:matricula/ordens",
  conferirMatriculaMiddleware("matricula"),
  conferirNivelAcessoMiddleware("ADMIN", "SUPERVISOR"),
  validateReq(criarOrdemSchema, "body"),
  homeCriarOsController
);

// DELETE -> Exclui ordem de serviço
homeRoutes.delete(
  "/home/:matricula/ordens/:numeroOs",
  conferirMatriculaMiddleware("matricula"),
  conferirNivelAcessoMiddleware("ADMIN"),
  validateReq(excluirOsSchema, "params"),
  homeExcluirOsController
);

// PUT -> Atualiza ordem(add/remove técnico, troca supervisor, atualiza status)
homeRoutes.put(
  "/home/:matricula/ordens/:numeroOs",
  conferirMatriculaMiddleware("matricula"),
  homeAtualizarOrdemController
);

// GET -> Lista todas as ordens do funcionário logado
homeRoutes.get(
  "/home/:matricula/ordens",
  conferirMatriculaMiddleware("matricula"),
  homeListarOrdensDoFuncionarioController
);

// GET -> Detalhes da ordem
homeRoutes.get(
  "/home/:matricula/ordens/:numeroOs",
  conferirMatriculaMiddleware("matricula"),
  validateReq(detalharOrdemFuncionarioSchema, "params"),
  homeDetalharOrdemFuncionarioController
);

// POST -> Adiciona um componente na subestação.
homeRoutes.post(
  "/home/:matricula/ordens/:numeroOs/subestacoes/:subestacaoId/componentes",
  conferirMatriculaMiddleware("matricula"),
  conferirNivelAcessoMiddleware("ADMIN", "SUPERVISOR"),
  validateGenerico(adicionarComponenteSchema),
  homeAdicionarComponenteController
);

// PUT -> Atualiza dados do componente
homeRoutes.put(
  "/home/:matricula/ordens/:numeroOs/subestacoes/:subestacaoId/componentes/:componenteId",
  conferirMatriculaMiddleware("matricula"),
  validateGenerico(atualizarComponenteSchema),
  homeAtualizarComponenteController
);

//DELETE -> Exclui componente da subestação
homeRoutes.delete(
  "/home/:matricula/ordens/:numeroOs/subestacoes/:subestacaoId/componentes/:componenteId",
  conferirMatriculaMiddleware("matricula"),
  conferirNivelAcessoMiddleware("ADMIN", "SUPERVISOR"),
  validateGenerico(excluirComponenteSchema),
  homeExcluirComponenteController
);

// GET -> Consulta componentes da Subestação
homeRoutes.get(
  "/home/:matricula/ordens/:numeroOs/subestacoes/:subestacaoId/componentes",
  conferirMatriculaMiddleware("matricula"),
  validateReq(listarComponentesDaSubestacaoSchema, "params"),
  homeListarComponentesDaOrdemController
);

// POST -> Adiciona ensaio ao componente
homeRoutes.post(
  "/home/:matricula/ordens/:numeroOs/subestacoes/:subestacaoId/componentes/:componenteId/ensaio",
  conferirMatriculaMiddleware("matricula"),
  validarEnsaioMiddleware(ensaioSchema, schemasPorTipo),
  verificarRelacionamentoMiddleware,
  homeAdicionarEnsaioComponenteController
);

// DELETE -> Exclui ensaio do componente
homeRoutes.delete(
  "/home/:matricula/ordens/:numeroOs/subestacoes/:subestacaoId/componentes/:componenteId/ensaio/:ensaioId",
  homeExcluirEnsaioComponenteController
);

// GET -> Lista os logs (exclusão de os, componente, funcionário, subestação, componente, ensaio)
homeRoutes.get(
  "/home/:matricula/logs",
  conferirMatriculaMiddleware("matricula"),
  conferirNivelAcessoMiddleware("ADMIN"),
  homeListarLogsController
);

// POST -> Cadastra equipamento
homeRoutes.post(
  "/home/:matricula/equipamentos",
  conferirMatriculaMiddleware("matricula"),
  conferirNivelAcessoMiddleware("ADMIN"),
  validateGenerico(cadastrarEquipamentoSchema),
  homeCadastrarEquipamentoController
);

// PUT -> Atualiza equipamento
homeRoutes.put(
  "/home/:matricula/equipamentos/:equipamentoId",
  conferirMatriculaMiddleware("matricula"),
  conferirNivelAcessoMiddleware("ADMIN"),
  validateGenerico(atualizarEquipamentoSchema),
  homeAtualizarEquipamentoController
);

// GET -> Lista todos equipamentos
homeRoutes.get(
  "/home/:matricula/equipamentos/",
  conferirMatriculaMiddleware("matricula"),
  validateGenerico(listarEquipamentosSchema),
  homeListarEquipamentosController
);

// DELETE -> Exclui equipamento
homeRoutes.delete(
  "/home/:matricula/equipamentos/:equipamentoId",
  conferirMatriculaMiddleware("matricula"),
  conferirNivelAcessoMiddleware("ADMIN"),
  validateGenerico(removerEquipamentoSchema),
  homeExcluirEquipamentoController
);
