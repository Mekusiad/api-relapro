import bcrypt from "bcrypt";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// # Seed para quando subir o projeto, cria o primeiro ADM.

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
