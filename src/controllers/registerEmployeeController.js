import { PrismaClient } from "../generated/prisma/index.js";

const prisma = new PrismaClient();

export const register = async (req, res) => {
  const { nome, usuario, matricula, cargo, admissao, senha, nivelAcesso } =
    req.body;

  const usuarioExist = await prisma.funcionario.findUnique({
    where: { usuario },
  });

  if (usuarioExist)
    return res.status(401).json({
      status: false,
      message: "Nome de usuário existente, tente outro.",
    });

  const matriculaExist = await prisma.funcionario.findUnique({
    where: { matricula },
  });

  if (matriculaExist)
    return res.status(401).json({
      status: false,
      message: "Matrícula existente, tente outro.",
    });

  try {
    const funcionario = await prisma.funcionario.create({
      data: {
        nome,
        usuario,
        matricula,
        cargo,
        admissao,
        senha,
        nivelAcesso: nivelAcesso || "técnico",
      },
    });

    res.status(201).json({
      status: true,
      id: funcionario.id,
      nome: funcionario.nome,
      usuario: funcionario.usuario,
      nivelAcesso: funcionario.nivelAcesso,
    });
  } catch (error) {
    res
      .status(500)
      .json({ status: false, message: "Erro ao registrar usuário" });
  }
};
