import { PrismaClient } from "../generated/prisma/index.js";

const prisma = new PrismaClient();

export const getOrderController = async (req, res) => {
  const { numeroOs } = req.params;
  console.log(numeroOs);

  const osExist = await prisma.ordem.findUnique({
    where: { numeroOs },
    include: {
      supervisor: { select: { nome: true, matricula: true } },
      tecnico: { select: { nome: true, matricula: true } },
      componente: true,
    },
  });

  if (!osExist)
    return res
      .status(400)
      .json({ status: false, message: "OS não encontrada e/ou não existe." });

  return res
    .status(200)
    .json({ status: true, message: "Ordem localizada.", osExist });
};
