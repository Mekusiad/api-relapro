import {
  adicionarComponente,
  adicionarTecnico,
  atualizarComponente,
  listarServicos,
  removerTecnico,
  trocarSupervisor,
} from "../services/ordemServices.js";
import { handleError } from "../utils/errorHandler.js";

export const novaOrdemController = async (req, res) => {
  const data = req.body;

  try {
    await novaOrdem(data);
  } catch (error) {
    return handleError(res, error, "Error ao criar ordem de serviço.");
  }
};

export const atualizarOrdemController = async (req, res) => {
  const { numeroOs } = req.params;
  const { type, data } = req.body;

  try {
    switch (type) {
      case "add-tecnico":
        try {
          await adicionarTecnico(numeroOs, data.tecnicoMatricula, res);
        } catch (error) {
          return handleError(res, error, "Erro ao adicionar técnico na OS.");
        }

      case "remove-tecnico":
        try {
          await removerTecnico(numeroOs, data.tecnicoMatricula, res);
        } catch (error) {
          return handleError(res, error, "Erro ao remover técnico da OS.");
        }

      case "trocar-supervisor":
        try {
          await trocarSupervisor(numeroOs, data.supervisorMatricula, res);
        } catch (error) {
          return handleError(res, error, "Erro ao trocar supervisor da OS.");
        }

      default:
        return res.status(400).json({
          status: false,
          message: `Tipo de operação '${type}' não suportado.`,
        });
    }
  } catch (error) {
    return handleError(res, error, "Erro interno no servidor.");
  }
};

export const adicionarComponenteController = async (req, res) => {
  try {
    const { data } = req.body;
    const { numeroOs } = req.params;
    await adicionarComponente(numeroOs, data);
  } catch (error) {
    return handleError(res, error, "Erro ao adicionar componente");
  }
};

export const atualizarComponenteController = async (req, res) => {
  try {
    const { numeroOs, numeroSerie } = req.params;
    const { data } = req.body;
    await atualizarComponente(numeroOs, numeroSerie, data);
  } catch (error) {
    return handleError(res, error, error.message);
  }
};

export const listarOrdemController = async (req, res) => {
  const { status } = req.query;

  try {
    await listarServicos(status);
  } catch (error) {
    return handleError(res, error, error.message);
  }
};
