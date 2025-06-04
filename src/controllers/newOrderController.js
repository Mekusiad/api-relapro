import { PrismaClient } from "../generated/prisma/index.js";

const prisma = new PrismaClient();

export const newOrder = async (req, res) => {
  const {
    cliente,
    nomeResponsavel,
    contato,
    email,
    localServico,
    descricaoInicial,
    previsaoInicio,
    supervisorMatricula,
    tecnicoMatricula,
    nivelAcesso,
  } = req.body;

  try {
    const osExist = await prisma.ordem.findFirst({
      where: {
        cliente,
        localServico,
        previsaoInicio,
        descricaoInicial,
      },
    });

    if (osExist)
      return res.status(409).json({
        status: false,
        message: `Já existe uma ordem de serviço com os mesmos dados: ${osExist.numeroOs}`,
      });

    if (nivelAcesso === "técnico")
      return res.status(403).json({
        status: false,
        message: "Usuário não autorizado a criar chamado.",
      });

    const now = new Date();

    const ano = now.getFullYear(); // ano vigente
    const mes = String(now.getMonth() + 1).padStart(2, "0"); // mês vigente

    const prefixo = `${ano}${mes}`; // cocatena ano+mês

    // Conta quantas OS já existem para o mês atual
    const countMes = await prisma.ordem.count({
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
    const novaOS = await prisma.ordem.create({
      data: {
        numeroOs: numberOs,
        cliente,
        nomeResponsavel,
        contato,
        email,
        localServico,
        descricaoInicial,
        previsaoInicio: new Date(previsaoInicio),
        supervisor: {
          connect: { matricula: supervisorMatricula },
        },
        tecnico: {
          connect: tecnicoMatricula.map((matricula) => ({
            matricula,
          })),
        },
        status: "aberta",
      },
      include: {
        supervisor: {
          select: {
            nome: true,
            matricula: true,
          },
        },
        tecnico: {
          select: {
            nome: true,
            matricula: true,
          },
        },
      },
    });
    res.status(201).json(novaOS);
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: "Erro ao criar Ordem de Serviço" });
  }
};
