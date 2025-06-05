import { PrismaClient } from "../generated/prisma/index.js";

const prisma = new PrismaClient();

export const adicionarTecnico = async (numeroOs, tecnicoMatricula) => {
  const ordem = await prisma.ordem.findUnique({
    where: { numeroOs },
    include: { tecnico: true },
  });

  const alreadyExists = ordem.tecnico.some(
    (t) => t.matricula === tecnicoMatricula
  );
  if (alreadyExists) throw new Error("Técnico já está vinculado à OS.");

  return await prisma.ordem.update({
    where: { numeroOs },
    data: {
      tecnico: {
        connect: { matricula: tecnicoMatricula },
      },
    },
    include: { tecnico: { select: { nome: true, matricula: true } } },
  });
};

export const removerTecnico = async (numeroOs, tecnicoMatricula) => {
  const ordem = await prisma.ordem.findUnique({
    where: { numeroOs },
    include: { tecnico: true },
  });

  const exists = ordem.tecnico.some((t) => t.matricula === tecnicoMatricula);
  if (!exists) throw new Error("Técnico não está vinculado à OS.");

  return await prisma.ordem.update({
    where: { numeroOs },
    data: {
      tecnico: {
        disconnect: { matricula: tecnicoMatricula },
      },
    },
    include: { tecnico: { select: { nome: true, matricula: true } } },
  });
};

export const trocarSupervisor = async (numeroOs, supervisorMatricula) => {
  const supervisor = await prisma.funcionario.findUnique({
    where: { matricula: supervisorMatricula },
  });

  if (!supervisor || supervisor.nivelAcesso !== "supervisor") {
    throw new Error("Matrícula informada não pertence a um supervisor.");
  }

  const ordem = await prisma.ordem.findUnique({
    where: { numeroOs },
    include: { supervisor: true },
  });

  const atualMatricula = ordem.supervisor?.matricula;

  if (atualMatricula === supervisorMatricula) {
    throw new Error("Supervisor informado já está vinculado.");
  }

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

export const adicionarComponente = async (numeroOs, data) => {
  const { numeroSerie } = data;
  const existing = await prisma.componente.findFirst({
    where: { numeroSerie, ordemOs: numeroOs },
  });
  if (existing)
    throw new Error(
      "Já existe um componente com esse número de série nesta OS."
    );

  return await prisma.componente.create({
    data: {
      ...data,
      ordem: { connect: { numeroOs } },
    },
  });
};

export const atualizarComponente = async (numeroOs, data) => {
  const { numeroSerie } = data;
  const existing = await prisma.componente.findFirst({
    where: { numeroSerie, ordemOs: numeroOs },
  });
  if (!existing) throw new Error("Componente não encontrado nesta OS.");

  return await prisma.trafo.update({
    where: { id: existing.id },
    data,
  });
};

export const listarServicos = async (numeroOs) => {
  const existing = await prisma.ordem.findMany();

  if (!existing)
    return res
      .status(400)
      .json({ status: false, message: "OS não encontrada e/ou não existe." });

  return existing;
};
