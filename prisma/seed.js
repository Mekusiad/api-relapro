import bcrypt from "bcrypt";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();



async function main() {
  const {
    ADMIN_NOME,
    ADMIN_MATRICULA,
    ADMIN_USUARIO,
    ADMIN_SENHA,
    ADMIN_CARGO,
  } = process.env;

  if (
    !ADMIN_NOME ||
    !ADMIN_MATRICULA ||
    !ADMIN_USUARIO ||
    !ADMIN_SENHA ||
    !ADMIN_CARGO
  ) {
    console.error(
      "❌ Variáveis de ambiente do administrador estão incompletas."
    );
    process.exit(1);
  }

  const adminExiste = await prisma.funcionario.findUnique({
    where: { usuario: ADMIN_USUARIO },
  });

  if (adminExiste) {
    console.log("✅ Usuário administrador já existe.");
    return;
  }

  const senhaCriptografada = await bcrypt.hash(ADMIN_SENHA, 10);

  await prisma.funcionario.create({
    data: {
      nome: ADMIN_NOME,
      matricula: ADMIN_MATRICULA,
      usuario: ADMIN_USUARIO,
      senha: senhaCriptografada,
      cargo: ADMIN_CARGO,
      nivelAcesso: "ADMIN",
    },
  });

    await prisma.funcionario.create({
    data: {
      nome: "DIEGO SOUZA DE SOUSA",
      matricula: "1819",
      usuario: "diego.souza",
      senha: await bcrypt.hash("123123", 10),
      cargo: 'Auxiliar Administrativo',
      nivelAcesso: "ADMIN",
    },
  });

      await prisma.funcionario.create({
    data: {
      nome: "WESLLEY VINICIUS NEVES ALVES",
      matricula: "1525",
      usuario: "weslley.alves",
      senha: await bcrypt.hash("123123", 10),
      cargo: 'ENGENHEIRO ELETRICISTA',
      nivelAcesso: "ADMIN",
    },
  });

        await prisma.funcionario.create({
    data: {
      nome: "LUIS HENRIQUE LOBATO DA SILVA",
      matricula: "1398",
      usuario: "luis.silva",
      senha: await bcrypt.hash("123123", 10),
      cargo: 'TÉCNICO ELETROMECANICO',
      nivelAcesso: "SUPERVISOR",
    },
  });

          await prisma.funcionario.create({
    data: {
      nome: "CESAR AUGUSTO DE LIMA GOMES",
      matricula: "700",
      usuario: "cesar.gomes",
      senha: await bcrypt.hash("123123", 10),
      cargo: 'ANALISTA DE SERVICOS TECNICOS II',
      nivelAcesso: "SUPERVISOR",
    },
  });

            await prisma.funcionario.create({
    data: {
      nome: "FRANCISCO DE ASSIS DE SOUSA PIMENTEL",
      matricula: "1647",
      usuario: "francisco.assis",
      senha: await bcrypt.hash("123123", 10),
      cargo: 'AUXILIAR DE SERVIÇOS TÉCNICOS',
      nivelAcesso: "TECNICO",
    },
  });

    await prisma.funcionario.create({
    data: {
      nome: "LUCAS PAES DE SOUZA",
      matricula: "1868",
      usuario: "lucas.paes",
      senha: await bcrypt.hash("123123", 10),
      cargo: 'AUXILIAR DE SERVIÇOS TÉCNICOS',
      nivelAcesso: "TECNICO",
    },
  });

    await prisma.funcionario.create({
    data: {
      nome: "MATHEUS BRITO BRAGA",
      matricula: "1386",
      usuario: "matheus.braga",
      senha: await bcrypt.hash("123123", 10),
      cargo: 'AUXILIAR DE SERVIÇOS TÉCNICOS',
      nivelAcesso: "TECNICO",
    },
  });

      await prisma.equipamento.create({
    data: {
      nome: "A",
      descricao: "A",
      modelo: "A",
      numeroSerie: "A",
    },
  });

        await prisma.equipamento.create({
    data: {
      nome: "B",
      descricao: "B",
      modelo: "B",
      numeroSerie: "B",
    },
  });

          await prisma.equipamento.create({
    data: {
      nome: "C",
      descricao: "C",
      modelo: "C",
      numeroSerie: "C",
    },
  });

            await prisma.equipamento.create({
    data: {
      nome: "D",
      descricao: "D",
      modelo: "D",
      numeroSerie: "D",
    },
  });

            await prisma.equipamento.create({
    data: {
      nome: "E",
      descricao: "E",
      modelo: "E",
      numeroSerie: "E",
    },
  });

  console.log("✅ Usuário administrador criado com sucesso!");
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
