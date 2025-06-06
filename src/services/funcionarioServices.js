import { PrismaClient } from "../generated/prisma/index.js";

const prisma = new PrismaClient();

export const registrarFuncionario = async (data) => {
  const usuarioExist = await prisma.funcionario.findUnique({
    where: { usuario: data.usuario },
  });

  if (usuarioExist)
    return res.status(400).json({
      status: false,
      message: "Nome de usuário existente, tente outro.",
    });

  const matriculaExist = await prisma.funcionario.findUnique({
    where: { matricula },
  });

  if (matriculaExist)
    return res
      .status(400)
      .json({ status: false, message: "Matrícula existente, tente outro." });

  const novoFuncionario = await prisma.funcionario.create({
    data: {
      nome,
      usuario,
      matricula,
      cargo,
      admissao,
      senha,
      nivelAcesso: nivelAcesso || "TECNICO",
    },
  });
  return res.status(201).json({
    status: true,
    message: "Funcionário adicionado com sucesso.",
    data: novoFuncionario,
  });
};

export const atualizarDadosFuncionario = async (matricula, data, res) => {
  const dadosAtualizados = await prisma.funcionario.update({
    where: { matricula: Number(matricula) },
    data,
  });
  if (!dadosAtualizados)
    return res
      .status(400)
      .json({ status: false, message: "Funcionário não localizado." });

  return res.status(200).json({
    status: true,
    message: "Dados atualizados com sucesso.",
  });
};

export const excluirFuncionario = async (matricula, res) => {
  const deletado = await prisma.funcionario.delete({
    where: { matricula: Number(matricula) },
  });
  if (!deletado)
    return res
      .status(400)
      .json({ status: false, message: "Funcionário não localizado." });

  return res.status(200).json({
    status: false,
    message: "Funcionário excluído com sucesso.",
    data: {
      nome: deletado.nome,
      cargo: deletado.cargo,
    },
  });
};

export const listarFuncionarios = async (req, res) => {
  const funcionarios = await prisma.funcionario.findMany();

  if (!funcionarios)
    return res.status(400).json({
      status: false,
      message: "No momento não possui funcionário cadastrado.",
    });

  return res.status(200).json({
    status: true,
    message: "Localizado com sucesso.",
    data: funcionarios,
  });
};

export const listarFuncionario = async (req, res) => {
  const { matricula } = req.params;
  const funcionario = await prisma.funcionario.findFirst({
    where: { matricula: Number(matricula) },
  });

  if (!funcionario)
    return res
      .status(400)
      .json({ status: false, message: "Funcionário não encontrado." });

  return res.status(200).json({
    status: true,
    message: "Funcionário localizado.",
    data: funcionario,
  });
};
