import { PrismaClient } from "../generated/prisma/index.js";

const prisma = new PrismaClient();

export const adicionarTecnico = async (numeroOs, tecnicoMatricula, res) => {
  const ordem = await prisma.ordem.findUnique({
    where: { numeroOs },
    include: { tecnico: true },
  });

  const alreadyExists = ordem.tecnico.some(
    (t) => t.matricula === tecnicoMatricula
  );
  if (alreadyExists)
    return res
      .status(400)
      .json({ status: false, message: "Técnico já está vinculado à OS." });

  const adicionado = await prisma.ordem.update({
    where: { numeroOs },
    data: {
      tecnico: {
        connect: { matricula: tecnicoMatricula },
      },
    },
    include: { tecnico: { select: { nome: true, matricula: true } } },
  });

  return res.status(200).json({
    status: true,
    message: "Técnico adicionado com sucesso.",
    data: adicionado.tecnico,
  });
};

export const removerTecnico = async (numeroOs, tecnicoMatricula, res) => {
  const ordem = await prisma.ordem.findUnique({
    where: { numeroOs },
    include: { tecnico: true },
  });

  const exists = ordem.tecnico.some((t) => t.matricula === tecnicoMatricula);
  if (!exists) throw new Error("Técnico não está vinculado à OS.");

  const removido = await prisma.ordem.update({
    where: { numeroOs },
    data: {
      tecnico: {
        disconnect: { matricula: tecnicoMatricula },
      },
    },
    include: { tecnico: { select: { nome: true, matricula: true } } },
  });

  return res.status(200).json({
    status: true,
    message: "Técnico removido com sucesso.",
    data: removido.tecnico,
  });
};

export const trocarSupervisor = async (numeroOs, supervisorMatricula, res) => {
  const supervisor = await prisma.funcionario.findUnique({
    where: { matricula: supervisorMatricula },
  });

  if (!supervisor || supervisor.nivelAcesso !== "supervisor")
    return res.status(401).json({
      status: false,
      message: "Matrícula informada não pertence a um supervisor.",
    });

  const ordem = await prisma.ordem.findUnique({
    where: { numeroOs },
    include: { supervisor: true },
  });

  const atualMatricula = ordem.supervisor?.matricula;

  if (atualMatricula === supervisorMatricula)
    return res.status(401).json({
      status: false,
      message: "Supervisor informado já está vinculado.",
    });

  return await prisma.ordem.update({
    where: { numeroOs },
    data: {
      supervisor: {
        disconnect: atualMatricula ? { matricula: atualMatricula } : undefined,
        connect: { matricula: novaMatricula },
      },
    },
  });
};

export const atualizaStatus = async (numeroOs, data, res) => {
  const statusOrdemAtualizada = await prisma.ordem.update({
    where: { numeroOs },
    data: {
      status: data.status,
    },
  });

  return res
    .status(200)
    .json(
      { status: true, message: "Status atualizado com sucesso." },
      statusOrdemAtualizada
    );
};

export const adicionarComponente = async (numeroOs, data, res) => {
  const { numeroSerie } = data;
  const componenteExiste = await prisma.componente.findFirst({
    where: { numeroSerie, ordemOs: numeroOs },
  });
  if (componenteExiste)
    return res.status(400).json({
      status: false,
      message: "Já existe um componente com esse número de série nesta OS.",
    });

  const componenteCriado = await prisma.componente.create({
    data: {
      ...data,
      ordem: { connect: { numeroOs } },
    },
  });
  return res.status(201).json({
    status: false,
    message: "Componente cadastrado com sucesso.",
    data: componenteCriado,
  });
};

export const novaOrdem = async (data, res) => {
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
  } = data;

  const ordemExist = await prisma.ordem.findFirst({
    where: {
      cliente,
      localServico,
      previsaoInicio,
      descricaoInicial,
    },
  });

  if (ordemExist)
    return res.status(409).json({
      status: false,
      message: `Já existe uma ordem de serviço com os mesmos dados: ${ordemExist.numeroOs}`,
    });

  if (nivelAcesso === "TECNICO")
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
          `${ano}-${String(Number(mes) + 1).padStart(2, "0")}-01T00:00:00.000Z`
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
      status: "ABERTA",
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

  return res.status(201).json({
    status: true,
    message: "Ordem de serviço criada com sucesso",
    data: novaOS,
  });
};

export const atualizarComponente = async (numeroOs, numeroSerie, data) => {
  const existing = await prisma.componente.findFirst({
    where: { numeroSerie, ordemOs: numeroOs },
  });
  if (!existing)
    res
      .status(400)
      .json({ status: false, message: "Componente não encontrado nesta OS." });

  const componenteAtualizado = await prisma.trafo.update({
    where: { id: existing.id },
    data,
  });

  return res.status(200).json({
    status: true,
    message: "Componente atualizado com sucesso.",
    daa: componenteAtualizado,
  });
};

export const listarServicos = async (status, res) => {
  const existing = await prisma.ordem.findMany({
    where: status ? { status } : {},
    orderBy: { createdAt: "desc" },
    include: {
      componente: true,
    },
  });
  if (existing.length === 0)
    return res.status(400).json({
      status: false,
      message: `No momento não possui OS em ${status}`,
      data: existing.length,
    });
  if (!existing)
    return res
      .status(400)
      .json({ status: false, message: "OS não encontrada e/ou não existe." });

  return res
    .status(200)
    .json({ status: true, message: "Ordem localizada.", data: existing });
};
