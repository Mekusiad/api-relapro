import {
  atualizarDadosFuncionario,
  excluirFuncionario,
  listarFuncionario,
  listarFuncionarios,
  registrarFuncionario,
} from "../services/funcionarioServices.js";
import { handleError } from "../utils/errorHandler.js";

export const regitrarFuncionarioController = async (req, res) => {
  const data = req.body;
  try {
    await registrarFuncionario(data);
  } catch (error) {
    return handleError(res, error, error.message);
  }
};

export const atualizarDadosFuncionarioController = async (req, res) => {
  const data = req.body;
  const { matricula } = req.params;
  try {
    await atualizarDadosFuncionario(matricula, data, res);
  } catch (error) {
    return handleError(res, error, error.message);
  }
};

export const excluirFuncionarioController = async (req, res) => {
  const { matricula } = req.params;
  try {
    await excluirFuncionario(matricula, res);
  } catch (error) {
    return handleError(res, error, error.message);
  }
};

export const listarFuncionariosController = async (req, res) => {
  try {
    await listarFuncionarios(req, res);
  } catch (error) {
    return handleError(res, error, error.message);
  }
};

export const listarFuncionarioController = async (req, res) => {
  try {
    await listarFuncionario(req, res);
  } catch (error) {
    return handleError(res, error, error.message);
  }
};
