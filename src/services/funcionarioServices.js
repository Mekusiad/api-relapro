import { PrismaClient } from "../generated/prisma/index.js";

const prisma = new PrismaClient();

export const registrarFuncionario = async (data) => {
  const usuarioExist = await prisma.funcionario.findUnique({
    where: { usuario: data.usuario },
  });

  if (usuarioExist) throw new Error("Nome de usuário existente, tente outro.");

  const matriculaExist = await prisma.funcionario.findUnique({
    where: { matricula },
  });

  if (matriculaExist) throw new Error("Matrícula existente, tente outro.");

  return await prisma.funcionario.create({
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
};

export const listarTodos = async (req, res) => {
  const funcionarios = await prisma.funcionario.findMany();
  if (!funcionarios)
    throw new Error("No momento não possui funcionário cadastrado.");

  return funcionarios;
};

export const listarFuncionario = async (matricula, data) => {
  const funcionarioExist = await prisma.funcionario.findFirst({
    where: { matricula: Number(matricula) },
  });

  if (!funcionarioExist) throw new Error("Funcionário não encontrado.");

  return funcionarioExist;
};
