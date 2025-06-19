import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
/**
 * Valida se o componente pertence à subestação e esta pertence à ordem.
 */
export const verificarParamsRelacionamento = async (
  numeroOs,
  subestacaoId,
  componenteId = null // valor padrão caso não venha
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
