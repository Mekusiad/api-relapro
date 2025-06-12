import {
  homeInfo,
  criarOs,
  listarFuncionarios,
  adicionarComponente,
  adicionarTecnicoNaOs,
  atualizarComponente,
  atualizaStatusOs,
  buscarFuncionarioPorMatricula,
  detalharOrdemFuncionario,
  listarComponentesDaOrdem,
  listarOrdensDoFuncionario,
  removerTecnicoNaOs,
  trocarSupervisorNaOs,
  excluirFuncionario,
  registrarFuncionario,
  atualizarDadosFuncionario,
  adicionarEnsaioComponente,
  excluirOs,
  listarLogs,
  excluirEnsaioComponente,
  excluirComponenteNaOs,
  cadastrarEquipamento,
  atualizarEquipamento,
  listarEquipamentos,
  excluirEquipamento,
  adicionarSubestacao,
  removerSubestacao,
  atualizarDadosSubestação,
  listarSubestacao,
} from "../services/homeServices.js";

import { conferirMatriculas } from "../utils/conferirMatriculas.js";

import { handleError } from "../utils/errorHandler.js";

export const homeInfoController = async (req, res) => {
  try {
    await homeInfo(req, res);
  } catch (error) {
    return handleError(res, error, error.message);
  }
};

export const homeRegistrarFuncionarioController = async (req, res) => {
  try {
    await registrarFuncionario(req, res);
  } catch (error) {
    return handleError(res, error, "Erro interno ao criar funcionário.");
  }
};

export const homeAtualizadosDadosFuncionarioController = async (req, res) => {
  try {
    await atualizarDadosFuncionario(req, res);
  } catch (error) {
    return handleError(
      res,
      error,
      "Erro interno ao atualizar dados de funcionário."
    );
  }
};

export const homeExcluirFuncionarioController = async (req, res) => {
  try {
    await excluirFuncionario(req, res);
  } catch (error) {
    return handleError(res, error, "Erro interno ao excluir funcionário.");
  }
};

export const homeListarFuncionarioController = async (req, res) => {
  try {
    await listarFuncionarios(req, res);
  } catch (error) {
    return handleError(res, error, error.message);
  }
};

export const homeListarOrdensDoFuncionarioController = async (req, res) => {
  try {
    await listarOrdensDoFuncionario(req, res);
  } catch (error) {
    return handleError(res, error, error.message);
  }
};

export const homeCriarOsController = async (req, res) => {
  try {
    await criarOs(req, res);
  } catch (error) {
    return handleError(res, error, error.message);
  }
};

export const homeExcluirOsController = async (req, res) => {
  try {
    await excluirOs(req, res);
  } catch (error) {
    return handleError(res, error, error.message);
  }
};

export const homeAtualizarOrdemController = async (req, res) => {
  const { matricula, numeroOs } = req.params;
  const data = req.body;

  if (!conferirMatriculas(matricula, req.funcionarioMatricula))
    return res.status(403).json({ status: false, message: "Acesso negado." });

  try {
    switch (data.type) {
      case "add-tecnico":
        return await adicionarTecnicoNaOs(numeroOs, data.tecnicoMatricula, res);

      case "remove-tecnico":
        return await removerTecnicoNaOs(numeroOs, data.tecnicoMatricula, res);

      case "trocar-supervisor":
        return await trocarSupervisorNaOs(
          numeroOs,
          data.supervisorMatricula,
          res
        );

      case "atualiza-status":
        return await atualizaStatusOs(numeroOs, data.status, res);

      default:
        return res.status(400).json({
          status: false,
          message: `Tipo de operação '${data.type}' não suportado.`,
        });
    }
  } catch (error) {
    return handleError(res, error, "Erro interno no servidor.");
  }
};

export const homeadicionarSubestacaoController = async (req, res) => {
  try {
    await adicionarSubestacao(req, res);
  } catch (error) {
    return handleError(res, error, error.message);
  }
};

export const homeListarSubestacaoController = async (req, res) => {
  try {
    await listarSubestacao(req, res);
  } catch (error) {
    return handleError(res, error, error.message);
  }
};

export const homeRemoverSubestacaoController = async (req, res) => {
  try {
    await removerSubestacao(req, res);
  } catch (error) {
    return handleError(res, error, error.message);
  }
};

export const homeAtualizarDadosSubestaçãoController = async (req, res) => {
  try {
    await atualizarDadosSubestação(req, res);
  } catch (error) {
    return handleError(res, error, error.message);
  }
};

export const homeDetalharOrdemFuncionarioController = async (req, res) => {
  try {
    await detalharOrdemFuncionario(req, res);
  } catch (error) {
    return handleError(res, error, error.message);
  }
};

export const homeListarComponentesDaOrdemController = async (req, res) => {
  try {
    await listarComponentesDaOrdem(req, res);
  } catch (error) {
    return handleError(res, error, error.message);
  }
};

export const homeBuscarFuncionarioPorMatriculaController = async (req, res) => {
  try {
    await buscarFuncionarioPorMatricula(req, res);
  } catch (error) {
    return handleError(res, error, error.message);
  }
};

export const homeAdicionarComponenteController = async (req, res) => {
  try {
    await adicionarComponente(req, res);
  } catch (error) {
    return handleError(
      res,
      error,
      "Erro interno no servidor ao adicionar componente."
    );
  }
};

export const homeAtualizarComponenteController = async (req, res) => {
  try {
    await atualizarComponente(req, res);
  } catch (error) {
    return handleError(
      res,
      error,
      "Erro interno no servidor ao atualizar componente."
    );
  }
};

export const homeExcluirComponenteController = async (req, res) => {
  try {
    await excluirComponenteNaOs(req, res);
  } catch (error) {
    return handleError(
      res,
      error,
      "Erro interno no servidor ao excluir componente."
    );
  }
};

export const homeAdicionarEnsaioComponenteController = async (req, res) => {
  try {
    await adicionarEnsaioComponente(req, res);
  } catch (error) {
    return handleError(
      res,
      error,
      "Erro interno no servidor ao adicionar ensaio ao componente."
    );
  }
};

export const homeExcluirEnsaioComponenteController = async (req, res) => {
  try {
    await excluirEnsaioComponente(req, res);
  } catch (error) {
    return handleError(
      res,
      error,
      "Erro interno no servidor ao excluir ensaio do componente."
    );
  }
};

export const homeListarLogsController = async (req, res) => {
  try {
    await listarLogs(req, res);
  } catch (error) {
    return handleError(res, error, "Erro interno no servidor ao listar logs.");
  }
};

export const homeCadastrarEquipamentoController = async (req, res) => {
  try {
    await cadastrarEquipamento(req, res);
  } catch (error) {
    return handleError(
      res,
      error,
      "Erro interno no servidor ao cadastrar equipamento."
    );
  }
};

export const homeAtualizarEquipamentoController = async (req, res) => {
  try {
    await atualizarEquipamento(req, res);
  } catch (error) {
    return handleError(
      res,
      error,
      "Erro interno no servidor ao atualizar equipamento."
    );
  }
};

export const homeListarEquipamentosController = async (req, res) => {
  try {
    await listarEquipamentos(req, res);
  } catch (error) {
    return handleError(
      res,
      error,
      "Erro interno no servidor ao listar equipamentos."
    );
  }
};

export const homeExcluirEquipamentoController = async (req, res) => {
  try {
    await excluirEquipamento(req, res);
  } catch (error) {
    return handleError(
      res,
      error,
      "Erro interno no servidor ao excluir equipamento."
    );
  }
};
