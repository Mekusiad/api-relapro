import {
  adicionarComponente,
  adicionarTecnico,
  atualizarComponente,
  listarServicos,
  removerTecnico,
  trocarSupervisor,
} from "../services/ordemServices.js";
import { handleError } from "../utils/errorHandler.js";

export const novaOrdem = async (req, res) => {
  const {
    cliente,
    nomeResponsavel,
    contato,
    email,
    localServico,
    descricaoInicial,
    previsaoInicio,
    supervisorMatricula,
    tecnicoMatricula,
    nivelAcesso,
  } = req.body;

  try {
    const osExist = await prisma.ordem.findFirst({
      where: {
        cliente,
        localServico,
        previsaoInicio,
        descricaoInicial,
      },
    });

    if (osExist)
      return res.status(409).json({
        status: false,
        message: `Já existe uma ordem de serviço com os mesmos dados: ${osExist.numeroOs}`,
      });

    if (nivelAcesso === "técnico")
      return res.status(403).json({
        status: false,
        message: "Usuário não autorizado a criar chamado.",
      });

    const now = new Date();

    const ano = now.getFullYear(); // ano vigente
    const mes = String(now.getMonth() + 1).padStart(2, "0"); // mês vigente

    const prefixo = `${ano}${mes}`; // cocatena ano+mês

    // Conta quantas OS já existem para o mês atual
    const countMes = await prisma.ordem.count({
      where: {
        createdAt: {
          gte: new Date(`${ano}-${mes}-01T00:00:00.000Z`),
          lt: new Date(
            `${ano}-${String(Number(mes) + 1).padStart(
              2,
              "0"
            )}-01T00:00:00.000Z`
          ),
        },
      },
    });

    const numeroSequencial = String(countMes + 1).padStart(3, "0"); // gera o próximo n° disponível do mês
    const numberOs = `${prefixo}${numeroSequencial}`; // cocatena com ano+mês+n°disponível do mês
    const novaOS = await prisma.ordem.create({
      data: {
        numeroOs: numberOs,
        cliente,
        nomeResponsavel,
        contato,
        email,
        localServico,
        descricaoInicial,
        previsaoInicio: new Date(previsaoInicio),
        supervisor: {
          connect: { matricula: supervisorMatricula },
        },
        tecnico: {
          connect: tecnicoMatricula.map((matricula) => ({
            matricula,
          })),
        },
        status: "aberta",
      },
      include: {
        supervisor: {
          select: {
            nome: true,
            matricula: true,
          },
        },
        tecnico: {
          select: {
            nome: true,
            matricula: true,
          },
        },
      },
    });
    res.status(201).json(novaOS);
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: "Erro ao criar Ordem de Serviço" });
  }
};

export const atualizarOrdemController = async (req, res) => {
  // Campo para realizar  a parte de validação schema
  const { numeroOs } = req.params;
  const { type, data } = req.body;

  try {
    switch (type) {
      case "add-tecnico":
        const added = await adicionarTecnico(numeroOs, data.tecnicoMatricula);
        return res.status(200).json({
          status: true,
          message: "Técnico adicionado com sucesso.",
          data: added.tecnico,
        });

      case "remove-tecnico":
        const removed = await removerTecnico(numeroOs, data.tecnicoMatricula);
        return res.status(200).json({
          status: true,
          message: "Técnico removido com sucesso.",
          data: removed.tecnico,
        });

      case "trocar-supervisor":
        await trocarSupervisor(numeroOs, data.supervisorMatricula);
        return res.status(200).json({
          status: true,
          message: "Supervisor trocado com sucesso.",
        });

      default:
        return res.status(400).json({
          status: false,
          message: `Tipo de operação '${type}' não suportado.`,
        });
    }
  } catch (error) {
    return handleError(res, error, error.message);
  }
};

export const adicionarComponenteController = async (req, res) => {
  const { numeroOs } = req.params;

  try {
    const { data } = req.body;
    const novoComponente = await adicionarComponente(numeroOs, data);
    return res
      .status(201)
      .json(
        { status: true, message: "Componente adicionado com sucesso." },
        novoComponente
      );
  } catch (error) {
    return handleError(res, error, error.message);
  }
};

export const atualizarComponenteController = async (req, res) => {
  const { numeroOs, numeroSerie } = req.params;

  try {
    const comoponenteAtualizado = await atualizarComponente(numeroOs, data);
    return res
      .status(200)
      .json(
        { status: true, message: "Componente atualizado com sucesso." },
        comoponenteAtualizado
      );
  } catch (error) {
    return handleError(res, error, error.message);
  }
};

export const listarOrdemController = async (req, res) => {
  const { numeroOs } = req.params;
  console.log(numeroOs);

  try {
    const osExist = await listarServicos(numeroOs);

    return res
      .status(200)
      .json({ status: true, message: "Ordem localizada.", osExist });
  } catch (error) {
    return handleError(res, error, error.message);
  }
};
