import { PrismaClient } from "../generated/prisma/index.js";

const prisma = new PrismaClient();

export const home = async (req, res) => {
  const decoded = req.decoded;

  const funcionario = await prisma.funcionario.findFirst({
    where: { matricula: Number(decoded.matricula) },
  });

  return res.status(200).json({
    status: true,
    message: "Usuário localizado.",
    data: {
      id: funcionario.id,
      nome: funcionario.nome,
      nivelAcesso: funcionario.nivelAcesso,
      supervisor: funcionario.supervisor,
      tecnico: funcionario.tecnico,
    },
  });
};
