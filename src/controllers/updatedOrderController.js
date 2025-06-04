import { PrismaClient } from "../generated/prisma/index.js";

const prisma = new PrismaClient();

export const updatedOrderController = async (req, res) => {
  const { numeroOs } = req.params;
  const { type, data } = req.body;

  try {
    const order = await prisma.ordem.findUnique({
      where: { numeroOs },
    });

    if (!order)
      return res
        .status(404)
        .json({ status: false, message: "OS não encontrada." });

    switch (type) {
      case "técnico":
        const osWithTechnicians = await prisma.ordem.findUnique({
          where: { numeroOs },
          include: { technicians: true },
        });

        const alreadyAdded = osWithTechnicians.tecnico.some(
          (tech) => tech.matricula === data.tecnicoMatricula
        );

        if (alreadyAdded) {
          return res.status(400).json({
            status: false,
            message: "Técnico já está vinculado à OS.",
          });
        }

        await prisma.ordem.update({
          where: { numeroOs },
          data: {
            tecnico: {
              connect: { matricula: data.tecnicoMatricula },
            },
          },
          include: {
            tecnico: {
              select: {
                nome: true,
                matricula: true,
              },
            },
          },
        });
        break;
      case "disjuntor":
        console.log("Trafo de força.");
        return res
          .status(201)
          .json({ status: true, message: "Atualizado com sucesso." });
        break;

      case "trafoCorrente":
        console.log("Trafo de corrente.");
        break;
      case "trafoPotência":
        console.log("Trafo de potência.");
        break;
      default:
        return res.status(400).json({
          status: false,
          message: `Tipo de equipamento '${type}' não suportado.`,
        });
    }

    return res.status(201).json({
      status: true,
      message: "Ordem de serviço atualizada com sucesso.",
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ status: false, message: "Erro ao adicionar equipamento." });
  }
};
