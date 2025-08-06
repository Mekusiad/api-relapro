import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const verificarParamsRelacionamento = async (
  numeroOs,
  subestacaoId,
  componenteId = null
) => {
  const where = {
    numeroOs,
    subestacoes: {
      some: {
        id: Number(subestacaoId),
        ...(componenteId && {
          componentes: {
            some: {
              id: Number(componenteId),
            },
          },
        }),
      },
    },
  };

  const resultado = await prisma.ordem.findFirst({
    where,
    select: { id: true },
  });

  return !!resultado;
};
