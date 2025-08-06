import express from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import {
  homeInfoController,
  homeListarComponentesDaOrdemController,
  homeDetalharOrdemFuncionarioController,
  homeListarFuncionarioController,
  homeListarOrdensDoFuncionarioController,
  homeBuscarFuncionarioPorMatriculaController,
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
  homeAtualizarDadosPrincipaisOsController,
  homeAtualizarComponentesDaSubestacaoController,
  homeExcluirFotoPorIdController,
  homeExcluirFotoEnsaioController,
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
  criarOrdemComSubestacoesSchema,
  atualizarOrdemSchema,
  excluirfotosDaOrdemSchema,
  excluirfotosDoEnsaioSchema,
} from "../validations/schema.js";
import { conferirMatriculaMiddleware } from "../middlewares/conferirMatriculaMiddleware.js";
import { conferirNivelAcessoMiddleware } from "../middlewares/conferirNivelAcessoMiddleware.js";
import { criarSubestacaoComComponente } from "../services/homeServices.js";

export const homeRoutes = express.Router();

homeRoutes.use(verifyToken);

homeRoutes.get(
  "/home",
  validateReq(homeInfoSchema, "custom"),
  homeInfoController
);

homeRoutes.post(
  "/home/:matricula/funcionarios",
  conferirMatriculaMiddleware("matricula"),
  conferirNivelAcessoMiddleware("ADMIN"),
  validateReq(registrarFuncionarioSchema, "body"),
  homeRegistrarFuncionarioController
);

homeRoutes.put(
  "/home/:matricula/funcionarios/:outraMatricula",
  conferirMatriculaMiddleware("matricula"),
  conferirNivelAcessoMiddleware("ADMIN"),
  validateReq(atualizarDadosFuncionarioSchema, "body"),
  homeAtualizadosDadosFuncionarioController
);

homeRoutes.delete(
  "/home/:matricula/funcionarios/:outraMatricula",
  conferirMatriculaMiddleware("matricula"),
  conferirNivelAcessoMiddleware("ADMIN"),
  validateReq(excluirFuncionarioSchema, "params"),
  homeExcluirFuncionarioController
);

homeRoutes.get(
  "/home/:matricula/funcionarios",
  conferirMatriculaMiddleware("matricula"),
  validateReq(listarFuncionariosSchema, "params"),
  homeListarFuncionarioController
);

homeRoutes.get(
  "/home/:matricula/funcionarios/:outraMatricula",
  conferirMatriculaMiddleware("matricula"),
  conferirNivelAcessoMiddleware("ADMIN", "SUPERVISOR"),
  validateReq(buscarFuncionarioPorMatriculaSchema, "params"),
  homeBuscarFuncionarioPorMatriculaController
);

homeRoutes.post(
  "/home/ordens",
  conferirNivelAcessoMiddleware("ADMIN", "SUPERVISOR"),
  validateReq(criarOrdemComSubestacoesSchema, "body"),
  homeCriarOsController
);

homeRoutes.delete(
  "/home/:matricula/ordens/:numeroOs",
  conferirMatriculaMiddleware("matricula"),
  conferirNivelAcessoMiddleware("ADMIN"),
  validateReq(excluirOsSchema, "params"),
  homeExcluirOsController
);

homeRoutes.put(
  "/home/:matricula/ordens/:numeroOs/dados-principais",
  conferirMatriculaMiddleware("matricula"),
  validateGenerico(atualizarOrdemSchema),
  homeAtualizarDadosPrincipaisOsController
);

homeRoutes.get(
  "/home/:matricula/ordens",
  conferirMatriculaMiddleware("matricula"),
  homeListarOrdensDoFuncionarioController
);

homeRoutes.get(
  "/home/:matricula/ordens/:numeroOs",
  conferirMatriculaMiddleware("matricula"),
  validateReq(detalharOrdemFuncionarioSchema, "params"),
  homeDetalharOrdemFuncionarioController
);

homeRoutes.post(
  "/home/:matricula/ordens/:numeroOs/subestacoes",
  conferirMatriculaMiddleware("matricula"),

  homeadicionarSubestacaoController
);

homeRoutes.post(
  "/home/:matricula/ordens/:numeroOs/subestacoes",
  conferirMatriculaMiddleware("matricula"),
  conferirNivelAcessoMiddleware("ADMIN"),

  criarSubestacaoComComponente
);

homeRoutes.get(
  "/home/:matricula/ordens/:numeroOs/subestacoes",
  conferirMatriculaMiddleware("matricula"),
  conferirNivelAcessoMiddleware("ADMIN"),
  validateReq(listarSubestacaoSchema, "params"),
  homeListarSubestacaoController
);

homeRoutes.delete(
  "/home/:matricula/ordens/:numeroOs/subestacoes/:subestacaoId",
  conferirMatriculaMiddleware("matricula"),
  conferirNivelAcessoMiddleware("ADMIN"),
  validateReq(removerSubestacaoSchema, "params"),
  homeRemoverSubestacaoController
);

homeRoutes.put(
  "/home/:matricula/ordens/:numeroOs/subestacoes/:subestacaoId",
  conferirMatriculaMiddleware("matricula"),
  conferirNivelAcessoMiddleware("ADMIN"),

  homeAtualizarDadosSubestaçãoController
);

homeRoutes.post(
  "/home/:matricula/ordens/:numeroOs/subestacoes/:subestacaoId/componentes",
  conferirMatriculaMiddleware("matricula"),
  conferirNivelAcessoMiddleware("ADMIN", "SUPERVISOR"),
  validateGenerico(adicionarComponenteSchema),
  homeAdicionarComponenteController
);

homeRoutes.put(
  "/home/:matricula/ordens/:numeroOs/subestacoes/:subestacaoId/componentes",
  conferirMatriculaMiddleware("matricula"),
  validateGenerico(atualizarComponenteSchema),
  homeAtualizarComponenteController
);

homeRoutes.put(
  "/home/:matricula/ordens/:numeroOs/subestacoes/:subestacaoId/componentes/:componenteId",
  conferirMatriculaMiddleware("matricula"),
  validateGenerico(atualizarComponenteSchema),
  homeAtualizarComponenteController
);

homeRoutes.delete(
  "/home/:matricula/ordens/:numeroOs/subestacoes/:subestacaoId/componentes/:componenteId",
  conferirMatriculaMiddleware("matricula"),
  conferirNivelAcessoMiddleware("ADMIN", "SUPERVISOR"),
  validateGenerico(excluirComponenteSchema),
  homeExcluirComponenteController
);

homeRoutes.get(
  "/home/:matricula/ordens/:numeroOs/subestacoes/:subestacaoId/componentes",
  conferirMatriculaMiddleware("matricula"),
  validateReq(listarComponentesDaSubestacaoSchema, "params"),
  homeListarComponentesDaOrdemController
);

homeRoutes.post(
  "/home/:matricula/ordens/:numeroOs/subestacoes/:subestacaoId/componentes/:componenteId/ensaio",
  conferirMatriculaMiddleware("matricula"),
  validarEnsaioMiddleware(ensaioSchema, schemasPorTipo),
  homeAdicionarEnsaioComponenteController
);

homeRoutes.delete(
  "/home/:matricula/ordens/:numeroOs/subestacoes/:subestacaoId/componentes/:componenteId/ensaio/:ensaioId",
  homeExcluirEnsaioComponenteController
);

homeRoutes.get(
  "/home/:matricula/logs",
  conferirMatriculaMiddleware("matricula"),
  conferirNivelAcessoMiddleware("ADMIN"),
  homeListarLogsController
);

homeRoutes.post(
  "/home/:matricula/equipamentos",
  conferirMatriculaMiddleware("matricula"),
  conferirNivelAcessoMiddleware("ADMIN"),
  validateGenerico(cadastrarEquipamentoSchema),
  homeCadastrarEquipamentoController
);

homeRoutes.put(
  "/home/:matricula/equipamentos/:equipamentoId",
  conferirMatriculaMiddleware("matricula"),
  conferirNivelAcessoMiddleware("ADMIN"),
  validateGenerico(atualizarEquipamentoSchema),
  homeAtualizarEquipamentoController
);

homeRoutes.get(
  "/home/:matricula/equipamentos/",
  conferirMatriculaMiddleware("matricula"),
  validateGenerico(listarEquipamentosSchema),
  homeListarEquipamentosController
);

homeRoutes.delete(
  "/home/:matricula/equipamentos/:equipamentoId",
  conferirMatriculaMiddleware("matricula"),
  conferirNivelAcessoMiddleware("ADMIN"),
  validateGenerico(removerEquipamentoSchema),
  homeExcluirEquipamentoController
);

homeRoutes.delete(
  "/home/:matricula/ordens/:numeroOs/fotos/:cloudinaryId",
  conferirMatriculaMiddleware("matricula"),
  conferirNivelAcessoMiddleware("ADMIN", "SUPERVISOR", "TECNICO"),
  validateReq(excluirfotosDaOrdemSchema, "params"),
  homeExcluirFotoPorIdController
);

homeRoutes.delete(
  "/home/:matricula/ensaios/:ensaioId/fotos/:cloudinaryId",
  conferirMatriculaMiddleware("matricula"),
  conferirNivelAcessoMiddleware("ADMIN", "SUPERVISOR", "TECNICO"),
  validateReq(excluirfotosDoEnsaioSchema, "params"),
  homeExcluirFotoEnsaioController
);
