import bcrypt from "bcrypt";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.funcionario.deleteMany();
  await prisma.ordem.deleteMany();
  await prisma.componente.deleteMany();
  // Cria Admin

  const admin = await prisma.funcionario.create({
    data: {
      nome: "admin",
      usuario: "admin",
      matricula: 111,
      cargo: "admin",
      admissao: "2025-04-01T00:00:00Z",
      senha: await bcrypt.hash("admin123", 10),
      nivelAcesso: "ADMIN",
    },
  });

  const admin1 = await prisma.funcionario.create({
    data: {
      nome: "Mauro Daisuke Medeiros Tahara",
      usuario: "mauro.tahara",
      matricula: 1,
      cargo: "Auxiliar Administrativo",
      admissao: "2025-04-01T00:00:00Z",
      senha: await bcrypt.hash("mauro123", 10),
      nivelAcesso: "ADMIN",
    },
  });

  const admin2 = await prisma.funcionario.create({
    data: {
      nome: "Diego Souza e Sousa",
      usuario: "diego.sousa",
      matricula: 2,
      cargo: "Auxiliar Administrativo",
      admissao: "2023-06-28T00:00:00Z",
      senha: await bcrypt.hash("diego123", 10),
      nivelAcesso: "ADMIN",
    },
  });

  // Cria Técnicos
  const tecnico = await prisma.funcionario.create({
    data: {
      nome: "tecnico",
      usuario: "tecnico",
      matricula: 333,
      cargo: "tecnico",
      admissao: "2020-04-01T00:00:00Z",
      senha: await bcrypt.hash("tecnico123", 10),
      nivelAcesso: "TECNICO",
    },
  });

  const tecnico1 = await prisma.funcionario.create({
    data: {
      nome: "Manuel Garcia Neto",
      usuario: "manuel.neto",
      matricula: 3,
      cargo: "Assistente de Serviços Técnicos",
      admissao: "2020-04-01T00:00:00Z",
      senha: await bcrypt.hash("manuel123", 10),
      nivelAcesso: "TECNICO",
    },
  });

  const tecnico2 = await prisma.funcionario.create({
    data: {
      nome: "Francisco de Assis",
      usuario: "francisco.assis",
      matricula: 4,
      cargo: "Assistente de Serviços Técnicos",
      admissao: "2023-04-01T00:00:00Z",
      senha: await bcrypt.hash("francisco123", 10),
      nivelAcesso: "TECNICO",
    },
  });

  const tecnico3 = await prisma.funcionario.create({
    data: {
      nome: "Lucas Paes",
      usuario: "lucas.paes",
      matricula: 5,
      cargo: "Auxiliar de Serviços Técnicos",
      admissao: "2024-04-01T00:00:00Z",
      senha: await bcrypt.hash("lucas123", 10),
      nivelAcesso: "TECNICO",
    },
  });

  // Cria Supervisor

  const supervisor = await prisma.funcionario.create({
    data: {
      nome: "supervisor",
      usuario: "supervisor",
      matricula: 222,
      cargo: "supervisor",
      admissao: "1995-04-01T00:00:00Z",
      senha: await bcrypt.hash("supervisor123", 10),
      nivelAcesso: "SUPERVISOR",
    },
  });

  const supervisor1 = await prisma.funcionario.create({
    data: {
      nome: "César Augusto",
      usuario: "cesar.augusto",
      matricula: 6,
      cargo: "Analista de Serviços Técnicos III",
      admissao: "1995-04-01T00:00:00Z",
      senha: await bcrypt.hash("supervisor123", 10),
      nivelAcesso: "SUPERVISOR",
    },
  });

  const supervisor2 = await prisma.funcionario.create({
    data: {
      nome: "Aluisio Maciel",
      usuario: "aluisio.maciel",
      matricula: 7,
      cargo: "Assistente de Serviços Técnicos III",
      admissao: "1995-06-02T00:00:00Z",
      senha: await bcrypt.hash("aluisio123", 10),
      nivelAcesso: "SUPERVISOR",
    },
  });

  // Cria Ordem de Serviço com supervisor e técnicos conectados
  const os = await prisma.ordem.create({
    data: {
      numeroOs: "25001",
      numeroOrcamento: "065-25",
      cliente: "LG",
      nomeResponsavel: "Rafael",
      contato: "92993552808",
      email: "rafael.batista@hotmail.com",
      localServico: "Av. Djalma Batista, n°151, Chapada",
      descricaoInicial: "Manutenção Preventiva em SE 69kV",
      previsaoInicio: new Date("2025-07-03T00:00:00Z"),
      supervisor: {
        connect: { matricula: supervisor1.matricula },
      },
      tecnico: {
        connect: [
          { matricula: tecnico1.matricula },
          { matricula: tecnico2.matricula },
        ],
      },
      status: "ABERTA",
    },
  });

  const os1 = await prisma.ordem.create({
    data: {
      numeroOs: "25002",
      numeroOrcamento: "064-25",
      cliente: "LG1",
      nomeResponsavel: "Rafael",
      contato: "92993552808",
      email: "rafael.batista@hotmail.com",
      localServico: "Av. Djalma Batista, n°151, Chapada",
      descricaoInicial: "Manutenção Preventiva em SE 69kV",
      previsaoInicio: new Date("2025-07-03T00:00:00Z"),
      supervisor: {
        connect: { matricula: supervisor2.matricula },
      },
      tecnico: {
        connect: [
          { matricula: tecnico2.matricula },
          { matricula: tecnico3.matricula },
        ],
      },
      status: "EM_ANDAMENTO",
    },
  });

  const os2 = await prisma.ordem.create({
    data: {
      numeroOs: "25003",
      numeroOrcamento: "063-25",
      cliente: "LG2",
      nomeResponsavel: "Rafael",
      contato: "92993552808",
      email: "rafael.batista@hotmail.com",
      localServico: "Av. Djalma Batista, n°151, Chapada",
      descricaoInicial: "Manutenção Preventiva em SE 69kV",
      previsaoInicio: new Date("2025-07-03T00:00:00Z"),
      supervisor: {
        connect: { matricula: supervisor1.matricula },
      },
      tecnico: {
        connect: [
          { matricula: tecnico1.matricula },
          { matricula: tecnico3.matricula },
        ],
      },
      status: "FINALIZADA",
    },
  });

  // Cria subestação
  const subestacao1 = await prisma.subestacao.create({
    data: {
      nome: "Subestação de 69kV",
      ordem: { connect: { numeroOs: "25003" } },
    },
  });

  // Cria componente
  await prisma.componente.create({
    data: {
      nomeEquipamento: "TRANSFORMADOR DE CORRENTE",
      tipo: "TRAFO_CORRENTE",
      subestacao: { connect: { id: subestacao1.id } },
    },
  });

  await prisma.componente.create({
    data: {
      nomeEquipamento: "RESISTOR DE ATERRAMENTO",
      tipo: "RESISTOR",
      subestacao: { connect: { id: subestacao1.id } },
    },
  });

  await prisma.componente.create({
    data: {
      nomeEquipamento: "TRANFORMADOR DE POTÊNCIA",
      tipo: "TRAFO_POTENCIA",
      subestacao: { connect: { id: subestacao1.id } },
    },
  });
}

main()
  .then(() => {
    console.log("✅ Seed executado com sucesso.");
    prisma.$disconnect();
  })
  .catch((e) => {
    console.error("Erro no seed:", e);
    prisma.$disconnect();
    process.exit(1);
  });
