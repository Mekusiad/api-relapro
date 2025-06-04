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
      case "add-tecnico": {
        const osWithTechnicians = await prisma.ordem.findUnique({
          where: { numeroOs },
          include: { tecnico: true },
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
      }

      case "remove-tecnico": {
        const osWithTechnicians = await prisma.ordem.findUnique({
          where: { numeroOs },
          include: { tecnico: true },
        });

        const alreadyAdded = osWithTechnicians.tecnico.some(
          (tech) => tech.matricula === data.tecnicoMatricula
        );

        if (!alreadyAdded) {
          return res.status(400).json({
            status: false,
            message: "Técnico não está vinculado à OS.",
          });
        }

        await prisma.ordem.update({
          where: { numeroOs },
          data: {
            tecnico: {
              disconnect: { matricula: data.tecnicoMatricula },
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

        res.status(200).json({
          status: true,
          message: `Técnico foi removido da OS.`,
        });
        break;
      }
      case "trocar-supervisor":
        const isSupervisor = await prisma.funcionario.findUnique({
          where: {
            matricula: data.supervisorMatricula,
            nivelAcesso: "supervisor",
          },
        });
        if (!isSupervisor)
          return res.status(400).json({
            status: false,
            message: "Matrícula não é de um Superior, tente outra.",
          });
        const osWithSupervisor = await prisma.ordem.findUnique({
          where: { numeroOs },
          include: { supervisor: true },
        });

        const alreadyAdded =
          osWithSupervisor.supervisor.matricula === data.supervisorMatricula;

        console.log(alreadyAdded);

        if (alreadyAdded) {
          return res.status(400).json({
            status: false,
            message:
              "Matrícula informada é a mesma vinculada na OS, tente outra.",
          });
        }

        await prisma.ordem.update({
          where: { numeroOs },
          data: {
            supervisor: {
              disconnect: { matricula: osWithSupervisor.supervisor.matricula },
              connect: { matricula: data.supervisorMatricula },
            },
          },
        });

        res.status(200).json({
          status: true,
          message: `Supervisor foi trocado na OS.`,
        });

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
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ status: false, message: "Erro ao adicionar equipamento." });
  }
};
