import { PrismaClient } from "../generated/prisma/index.js";

const prisma = new PrismaClient();

export const updatedOrderController = async (req, res) => {
  const { numberOs } = req.params;
  const { type, data } = req.body;

  try {
    const order = await prisma.order.findUnique({
      where: { numberOs },
    });

    if (!order)
      return res
        .status(404)
        .json({ status: false, message: "OS não encontrada." });

    switch (type) {
      case "técnico":
        const osWithTechnicians = await prisma.order.findUnique({
          where: { numberOs },
          include: { technicians: true },
        });

        const alreadyAdded = osWithTechnicians.technicians.some(
          (tech) => tech.registration === data.techniciansRegistration
        );

        if (alreadyAdded) {
          return res.status(400).json({
            status: false,
            message: "Técnico já está vinculado à OS.",
          });
        }

        await prisma.order.update({
          where: { numberOs },
          data: {
            technicians: {
              connect: { registration: data.techniciansRegistration },
            },
          },
          include: {
            technicians: {
              select: {
                name: true,
                registration: true,
              },
            },
          },
        });
        break;
      case "trafoForca":
        const osWithStreghTransformer = await prisma.order.findUnique({
          where: { numberOs },
          include: {
            strengthTransformer: true,
          },
        });

        const alreadyStregh = osWithStreghTransformer.strengthTransformer.some(
          (t) => t.serialNumber === data.serialNumber
        );

        if (alreadyStregh)
          return res.status(400).json({
            status: false,
            message: "Transformador já vinculado à OS.",
          });

        await prisma.strengthTransformer.create({
          data: {
            ...data,
            order: {
              connect: { numberOs },
            },
          },
        });
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
