import {
  listarFuncionario,
  listarTodos,
  registrarFuncionario,
} from "../services/funcionarioServices.js";
import { handleError } from "../utils/errorHandler.js";

export const regitrarFuncionarioController = async (req, res) => {
  const data = req.body;
  try {
    await registrarFuncionario(data);
    return res
      .status(201)
      .json({ status: true, message: "Funcionário cadastrado com sucesso." });
  } catch (error) {
    return handleError(res, error, error.message);
  }
};

export const listarFuncionariosController = async (req, res) => {
  const data = req.body;

  try {
    const funcionarios = await listarTodos(data);
    return res
      .status(200)
      .json({ status: true, message: "Localizado com sucesso.", funcionarios });
  } catch (error) {
    return handleError(res, error, error.message);
  }
};

export const listarFuncionarioController = async (req, res) => {
  const { matricula } = req.params;
  const data = req.body;
  try {
    const funcionario = await listarFuncionario(matricula, data);

    return res
      .status(200)
      .json({ status: true, message: "Funcionário localizado.", funcionario });
  } catch (error) {
    return handleError(res, error, error.message);
  }
};
