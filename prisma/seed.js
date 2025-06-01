import { PrismaClient } from "../src/generated/prisma/index.js";

const prisma = new PrismaClient();

async function main() {
  // Cria Admin
  const admin1 = await prisma.employee.create({
    data: {
      name: "Mauro Daisuke Medeiros Tahara",
      username: "mauro.tahara",
      registration: 0,
      employeeRole: "Auxiliar Administrativo",
      hireDate: "2025-04-01T00:00:00Z",
      password: "mauro123",
      accessLevel: "admin",
    },
  });

  const admin2 = await prisma.employee.create({
    data: {
      name: "Diego Souza e Sousa",
      username: "diego.sousa",
      registration: 1,
      employeeRole: "Auxiliar Administrativo",
      hireDate: "2023-06-28T00:00:00Z",
      password: "diego123",
      accessLevel: "admin",
    },
  });

  // Cria Técnicos
  const technician1 = await prisma.employee.create({
    data: {
      name: "Manuel Garcia Neto",
      username: "manuel.neto",
      registration: 2,
      employeeRole: "Assistente de Serviços Técnicos",
      hireDate: "2020-04-01T00:00:00Z",
      password: "manuel123",
      accessLevel: "técnico",
    },
  });

  const technician2 = await prisma.employee.create({
    data: {
      name: "Francisco de Assis",
      username: "francisco.assis",
      registration: 4,
      employeeRole: "Assistente de Serviços Técnicos",
      hireDate: "2023-04-01T00:00:00Z",
      password: "francisco123",
      accessLevel: "técnico",
    },
  });

  const technician3 = await prisma.employee.create({
    data: {
      name: "Lucas Paes",
      username: "lucas.paes",
      registration: 5,
      employeeRole: "Auxiliar de Serviços Técnicos",
      hireDate: "2024-04-01T00:00:00Z",
      password: "lucas123",
      accessLevel: "técnico",
    },
  });

  // Cria Supervisor
  const supervisor1 = await prisma.employee.create({
    data: {
      name: "César Augusto",
      username: "cesar.augusto",
      registration: 3,
      employeeRole: "Analista de Serviços Técnicos III",
      hireDate: "1995-04-01T00:00:00Z",
      password: "cesar123",
      accessLevel: "Supervisor",
    },
  });

  // Cria Ordem de Serviço com supervisor e técnicos conectados
  await prisma.order.create({
    data: {
      numberOs: "202506001",
      client: "LG",
      contact: "Rafael",
      phone: "92993552808",
      email: "rafael.batista@hotmail.com",
      localService: "Av. Djalma Batista, n°151, Chapada",
      initialDescription: "Manutenção Preventiva em SE 69kV",
      previousInitialDate: new Date("2025-07-03T00:00:00Z"),
      supervisorRegistration: supervisor1.registration,
      technicians: {
        connect: [
          { registration: technician1.registration },
          { registration: technician2.registration },
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
