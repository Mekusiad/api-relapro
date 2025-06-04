import { PrismaClient } from "../src/generated/prisma/index.js";

const prisma = new PrismaClient();

async function main() {
  // Cria Admin
  const admin1 = await prisma.funcionario.create({
    data: {
      nome: "Mauro Daisuke Medeiros Tahara",
      usuario: "mauro.tahara",
      matricula: 0,
      cargo: "Auxiliar Administrativo",
      admissao: "2025-04-01T00:00:00Z",
      senha: "mauro123",
      nivelAcesso: "admin",
    },
  });

  const admin2 = await prisma.funcionario.create({
    data: {
      nome: "Diego Souza e Sousa",
      usuario: "diego.sousa",
      matricula: 1,
      cargo: "Auxiliar Administrativo",
      admissao: "2023-06-28T00:00:00Z",
      senha: "diego123",
      nivelAcesso: "admin",
    },
  });

  // Cria Técnicos
  const technician1 = await prisma.funcionario.create({
    data: {
      nome: "Manuel Garcia Neto",
      usuario: "manuel.neto",
      matricula: 2,
      cargo: "Assistente de Serviços Técnicos",
      admissao: "2020-04-01T00:00:00Z",
      senha: "manuel123",
      nivelAcesso: "técnico",
    },
  });

  const technician2 = await prisma.funcionario.create({
    data: {
      nome: "Francisco de Assis",
      usuario: "francisco.assis",
      matricula: 4,
      cargo: "Assistente de Serviços Técnicos",
      admissao: "2023-04-01T00:00:00Z",
      senha: "francisco123",
      nivelAcesso: "técnico",
    },
  });

  const technician3 = await prisma.funcionario.create({
    data: {
      nome: "Lucas Paes",
      usuario: "lucas.paes",
      matricula: 5,
      cargo: "Auxiliar de Serviços Técnicos",
      admissao: "2024-04-01T00:00:00Z",
      senha: "lucas123",
      nivelAcesso: "técnico",
    },
  });

  // Cria Supervisor
  const supervisor1 = await prisma.funcionario.create({
    data: {
      nome: "César Augusto",
      usuario: "cesar.augusto",
      matricula: 3,
      cargo: "Analista de Serviços Técnicos III",
      admissao: "1995-04-01T00:00:00Z",
      senha: "cesar123",
      nivelAcesso: "Supervisor",
    },
  });

  // Cria Ordem de Serviço com supervisor e técnicos conectados
  await prisma.ordem.create({
    data: {
      numeroOs: "202506001",
      cliente: "LG",
      nomeResponsavel: "Rafael",
      contato: "92993552808",
      email: "rafael.batista@hotmail.com",
      localServico: "Av. Djalma Batista, n°151, Chapada",
      descricaoInicial: "Manutenção Preventiva em SE 69kV",
      previsaoInicio: new Date("2025-07-03T00:00:00Z"),
      supervisormatricula: supervisor1.matricula,
      tecnico: {
        connect: [
          { matricula: technician1.matricula },
          { matricula: technician2.matricula },
        ],
      },
      status: "aberta",
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
