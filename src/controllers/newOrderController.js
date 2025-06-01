import { PrismaClient } from "../generated/prisma/index.js";

const prisma = new PrismaClient();

export const newOrder = async (req, res) => {
  const {
    client,
    contact,
    phone,
    email,
    localService,
    initialDescription,
    previousInitialDate,
    responsibleTechnicianId,
    acessLevel,
  } = req.body;

  if (acessLevel === "técnico")
    return res.status(403).json({
      status: false,
      message: "Usuário não autorizado a criar chamado.",
    });

  try {
    const now = new Date();

    const ano = now.getFullYear(); // ano vigente
    const mes = String(now.getMonth() + 1).padStart(2, "0"); // mês vigente

    const prefixo = `${ano}${mes}`; // cocatena ano+mês

    // Conta quantas OS já existem para o mês atual
    const countMes = await prisma.order.count({
      where: {
        createdAt: {
          gte: new Date(`${ano}-${mes}-01T00:00:00.000Z`),
          lt: new Date(
            `${ano}-${String(Number(mes) + 1).padStart(
              2,
              "0"
            )}-01T00:00:00.000Z`
          ),
        },
      },
    });

    const numeroSequencial = String(countMes + 1).padStart(3, "0"); // gera o próximo n° disponível do mês

    const numberOs = `${prefixo}${numeroSequencial}`; // cocatena com ano+mês+n°disponível do mês
    const novaOS = await prisma.order.create({
      data: {
        numberOs,
        client,
        contact,
        phone,
        email,
        localService,
        initialDescription,
        previousInitialDate,
        responsibleTechnicianId,
        status: "aberta",
      },
    });

    res.status(201).json(novaOS);
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: "Erro ao criar Ordem de Serviço" });
  }
};
