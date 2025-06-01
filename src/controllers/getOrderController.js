import { PrismaClient } from "../generated/prisma/index.js";

const prisma = new PrismaClient();

export const getOrderController = async (req, res) => {
  const { numberOs } = req.params;

  const osExist = await prisma.order.findUnique({
    where: { numberOs },
    include: {
      supervisor: { select: { name: true, registration: true } },
      technicians: { select: { name: true, registration: true } },
      highTransformer: true,
      strengthTransformer: true,
      potencialTransformer: true,
      currentTransformer: true,
      circuitBreaker: true,
      disconnectorSwitch: true,
      groundingMesh: true,
      groundingResistor: true,
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
