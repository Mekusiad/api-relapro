import { PrismaClient } from "../generated/prisma/index.js";
import { conferirMatriculas } from "../utils/conferirMatriculas.js";
import { listarOrdensDoFuncionarioSchema } from "../validations/schema.js";

const prisma = new PrismaClient();

export const homeInfo = async (req, res) => {
  const decodedMatricula = req.validatedData.funcionarioMatricula;

  const funcionario = await prisma.funcionario.findFirst({
    where: { matricula: Number(decodedMatricula) },
  });

  if (!funcionario)
    return res
      .status(404)
      .json({ status: false, message: "Funcionário não encontrado." });

  let estatisticasOS = null;

  // Filtros baseados no nível de acesso
  let filtroOrdens = {};

  if (funcionario.nivelAcesso === "ADMIN") {
    // Sem filtro, acesso total
    filtroOrdens = {};
  } else if (funcionario.nivelAcesso === "SUPERVISOR") {
    // Acesso apenas a ordens onde é supervisor ou técnico
    filtroOrdens = {
      OR: [
        {
          supervisorMatricula: Number(funcionario.matricula),
        },
        {
          tecnico: {
            some: {
              matricula: Number(funcionario.matricula),
            },
          },
        },
      ],
    };
  } else if (funcionario.nivelAcesso === "TECNICO") {
    // Acesso apenas a ordens onde é técnico
    filtroOrdens = {
      tecnico: {
        some: {
          matricula: Number(funcionario.matricula),
        },
      },
    };
  }
  // Carrega estatísticas baseadas no filtro
  const [abertas, andamento, finalizadas, ordens] = await Promise.all([
    prisma.ordem.count({ where: { ...filtroOrdens, status: "ABERTA" } }),
    prisma.ordem.count({ where: { ...filtroOrdens, status: "EM_ANDAMENTO" } }),
    prisma.ordem.count({ where: { ...filtroOrdens, status: "FINALIZADA" } }),
    prisma.ordem.findMany({
      where: filtroOrdens,
      select: {
        id: true,
        numeroOs: true,
        cliente: true,
        status: true,
        previsaoInicio: true,
        previsaoTermino: true,
      },
      orderBy: { createdAt: "desc" },
      take: 10, // opcional: limitar a 10 últimas ordens
    }),
  ]);

  estatisticasOS = {
    abertas,
    andamento,
    finalizadas,
  };

  return res.status(200).json({
    status: true,
    message: "Usuário logado com sucesso.",
    data: {
      id: funcionario.id,
      nome: funcionario.nome,
      matricula: funcionario.matricula,
      nivelAcesso: funcionario.nivelAcesso,
      supervisor: funcionario.supervisor,
      tecnico: funcionario.tecnico,
      estatisticasOS,
      ordens,
    },
  });
};

export const registrarFuncionario = async (req, res) => {
  const data = req.validatedData; // <-- dados validados aqui

  const matriculaExist = await prisma.funcionario.findFirst({
    where: { matricula: data.matricula },
  });

  if (matriculaExist)
    return res
      .status(400)
      .json({ status: false, message: "Matrícula existente, tente outra." });

  const usuarioExiste = await prisma.funcionario.findFirst({
    where: { usuario: data.usuario },
  });

  if (usuarioExiste)
    return res
      .status(400)
      .json({ status: false, message: "Usuário existente, tente outra." });

  await prisma.funcionario.create({
    data: {
      nome: data.nome,
      usuario: data.usuario,
      matricula: data.matricula,
      cargo: data.cargo,
      admissao: new Date(data.admissao),
      senha: data.senha,
      nivelAcesso: data.nivelAcesso || "TECNICO",
    },
  });

  return res
    .status(201)
    .json({ status: false, message: "Funcionário cadastrado com sucesso." });
};

export const atualizarDadosFuncionario = async (req, res) => {
  const outraMatricula = Number(req.params.outraMatricula);
  const data = req.validatedData;

  const dadosAtualizados = await prisma.funcionario.update({
    where: { matricula: Number(outraMatricula) },
    data,
  });

  if (!dadosAtualizados)
    return res.status(400).json({
      status: false,
      message: "Erro ao atualizar dados de funcionário.",
    });

  return res.status(200).json({
    status: true,
    message: "Dados atualizados com sucesso.",
  });
};

export const excluirFuncionario = async (req, res) => {
  const { matricula, outraMatricula } = req.params;
  const { funcionarioMatricula } = req;

  if (matricula === outraMatricula)
    return res.status(401).json({
      status: false,
      message: "Acesso negado, não é permitido excluir a si mesmo.",
    });

  // 📝 Obter dados antes da exclusão
  const funcionarioExcluido = await prisma.funcionario.findUnique({
    where: { matricula: Number(outraMatricula) },
  });

  if (!funcionarioExcluido)
    return res
      .status(404)
      .json({ status: false, message: "Funcionário não encontrado." });

  await prisma.funcionario.delete({
    where: { matricula: Number(outraMatricula) },
  });

  // 🪵 Registrar log
  await prisma.logAtividade.create({
    data: {
      acao: "EXCLUIR",
      entidade: "funcionario",
      dadosAfetados: funcionarioExcluido,
      feitoPor: funcionarioMatricula,
    },
  });

  return res
    .status(200)
    .json({ status: true, message: "Funcionário excluído com sucesso." });
};

export const listarFuncionarios = async (req, res) => {
  const funcionarios = await prisma.funcionario.findMany({
    orderBy: {
      nome: "asc",
    },
  });
  const { funcionarioNivelAcesso } = req;

  const data =
    funcionarioNivelAcesso === "SUPERVISOR"
      ? funcionarios.map(({ senha, nivelAcesso, ...rest }) => rest)
      : funcionarios;

  return res
    .status(200)
    .json({ status: true, messagem: "Lista de funcionários.", data });
};

export const listarOrdensDoFuncionario = async (req, res) => {
  const paramsValid = listarOrdensDoFuncionarioSchema.params.safeParse(
    req.params
  );
  const queryValid = listarOrdensDoFuncionarioSchema.query.safeParse(req.query);

  if (!paramsValid.success || !queryValid.success) {
    return res.status(400).json({
      status: false,
      message: "Erro de validação.",
      errors: {
        params: !paramsValid.success ? paramsValid.error.format() : null,
        query: !queryValid.success ? queryValid.error.format() : null,
      },
    });
  }
  const { matricula } = paramsValid.data;
  const { status, numeroOs, cliente, page } = queryValid.data;
  const nivelAcesso = req.funcionarioNivelAcesso;

  const limit = 10;
  const skip = (page - 1) * limit;

  const where = {
    ...(status ? { status: String(status) } : {}),
    ...(numeroOs ? { numeroOs: { equals: String(numeroOs) } } : {}),
    ...(cliente
      ? {
          cliente: {
            contains: String(cliente.toLowerCase()),
            // mode: "insensitive"
          },
        }
      : {}),
    ...(nivelAcesso === "ADMIN"
      ? {}
      : {
          OR: [
            { supervisorMatricula: matricula },
            { tecnico: { some: { matricula } } },
          ],
        }),
  };
  // Buscar as ordens com paginação
  const ordens = await prisma.ordem.findMany({
    where,
    orderBy: {
      createdAt: "desc",
    },
    take: limit, // Limita para 10 resultados
    skip, // Pula os registros das páginas anteriores
    include: {
      tecnico: {
        select: { nome: true, matricula: true },
      },
      supervisor: { select: { nome: true, matricula: true } },
      subestacoes: {
        include: {
          componentes: { include: { ensaioTrafoCorrente: true } },
        },
      },
    },
  });

  // Contar o total de ordens para calcular número de páginas
  const totalOrdens = await prisma.ordem.count({ where });
  const totalPages = Math.ceil(totalOrdens / limit);

  return res.status(200).json({
    status: true,
    message:
      ordens.length > 0
        ? "Ordens localizadas."
        : "Nenhum dado encontrado com base no filtro usado.",
    data: { currentPage: page, totalPages, totalOrdens, ordens },
  });
};

export const criarOs = async (req, res) => {
  const data = req.validatedData;

  const ordemExist = await prisma.ordem.findFirst({
    where: {
      cliente: data.cliente,
      localServico: data.localServico,
      previsaoInicio: data.previsaoInicio,
      descricaoInicial: data.descricaoInicial,
    },
  });

  if (ordemExist)
    return res.status(403).json({
      status: false,
      message: `Serviço já existe e está vinculada à OS ${ordemExist.numeroOs}`,
    });

  // Verificar se supervisor existe
  const supervisorExiste = await prisma.funcionario.findUnique({
    where: { matricula: Number(data.supervisorMatricula) },
  });

  if (!supervisorExiste) {
    return res.status(404).json({
      status: false,
      message: `Supervisor com matrícula ${data.supervisorMatricula} não encontrado.`,
    });
  }

  // Verificar técnicos (se enviados)
  if (data.tecnicoMatricula && data.tecnicoMatricula.length > 0) {
    const tecnicos = await prisma.funcionario.findMany({
      where: {
        matricula: { in: data.tecnicoMatricula },
      },
    });

    if (tecnicos.length !== data.tecnicoMatricula.length) {
      const encontrados = tecnicos.map((t) => t.matricula);
      const naoEncontrados = data.tecnicoMatricula.filter(
        (m) => !encontrados.includes(m)
      );
      return res.status(404).json({
        status: false,
        message: `Técnico(s) não encontrado(s): ${naoEncontrados.join(", ")}`,
      });
    }
  }

  const now = new Date();
  const ano = now.getFullYear();

  // Conta quantas OS "ABERTA" já existem no ano atual
  const countAno = await prisma.ordem.count({
    where: {
      status: "ABERTA",
      createdAt: {
        gte: new Date(`${ano}-01-01T00:00:00.000Z`),
        lt: new Date(`${ano + 1}-01-01T00:00:00.000Z`),
      },
    },
  });

  const numeroSequencial = String(countAno + 1).padStart(3, "0"); // Ex: 001, 012, 103
  const numberOs = `${ano}${numeroSequencial}`; // Ex: 2025001, 2025012

  await prisma.ordem.create({
    data: {
      numeroOs: numberOs,
      cliente: data.cliente,
      nomeResponsavel: data.nomeResponsavel,
      contato: data.contato,
      email: data.email,
      localServico: data.localServico,
      descricaoInicial: data.descricaoInicial,
      previsaoInicio: new Date(data.previsaoInicio),
      ...(data.supervisorMatricula && {
        supervisor: {
          connect: { matricula: Number(data.supervisorMatricula) },
        },
      }),
      ...(data.tecnicoMatricula &&
        data.tecnicoMatricula.length > 0 && {
          tecnico: {
            connect: data.tecnicoMatricula.map((matricula) => ({
              matricula: Number(matricula),
            })),
          },
        }),
      status: data?.status || "ABERTA",
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
  return res
    .status(201)
    .json({ status: true, message: "OS criada com sucesso." });
};

export const excluirOs = async (req, res) => {
  const { matricula, numeroOs } = req.validatedData;

  // 📝 Obter dados antes da exclusão
  const ordemExcluida = await prisma.ordem.findUnique({
    where: { numeroOs },
  });

  if (!ordemExcluida)
    return res.status(404).json({
      status: false,
      message: "OS não encontrada ou já foi excluída.",
    });

  await prisma.ordem.delete({
    where: {
      numeroOs,
    },
  });

  // 🪵 Registrar log
  await prisma.logAtividade.create({
    data: {
      acao: "EXCLUIR",
      entidade: "ordem",
      dadosAfetados: ordemExcluida,
      feitoPor: Number(matricula),
    },
  });

  return res
    .status(200)
    .json({ status: true, message: "OS excluída com sucesso." });
};

export const adicionarTecnicoNaOs = async (req, res) => {
  const { numeroOs } = req.params;
  const { tecnicoMatricula } = req.body;
  const ordem = await prisma.ordem.findUnique({
    where: { numeroOs },
    include: { tecnico: true },
  });

  if (!ordem)
    return res
      .status(403)
      .json({ status: false, message: "OS não encontrada ou foi excluída" });

  if (
    req.funcionarioMatricula.length > 0
      ? req.funcionarioMatricula.includes(ordem.supervisorMatricula)
      : req.funcionarioMatricula === ordem.supervisorMatricula
  )
    return res.status(403).json({
      status: false,
      message: "Matrícula já está vinculada a um supervisor.",
    });

  const alreadyExists = ordem.tecnico.some((t) =>
    tecnicoMatricula.includes(t.matricula)
  );

  if (alreadyExists)
    return res
      .status(400)
      .json({ status: false, message: "Técnico já está vinculado à OS." });

  const adicionado = await prisma.ordem.update({
    where: { numeroOs },
    data: {
      ...(tecnicoMatricula &&
        tecnicoMatricula.length > 0 && {
          tecnico: {
            connect: tecnicoMatricula.map((matricula) => ({ matricula })),
          },
        }),
    },
    include: { tecnico: { select: { nome: true, matricula: true } } },
  });

  return res.status(200).json({
    status: true,
    message: "Técnico adicionado com sucesso.",
    data: adicionado.tecnico,
  });
};

export const removerTecnicoNaOs = async (req, res) => {
  const { numeroOs } = req.params;
  let { tecnicoMatricula } = req.body; // Pode ser um número ou array

  // Garante que seja sempre um array
  if (!Array.isArray(tecnicoMatricula)) {
    if (typeof tecnicoMatricula === "number") {
      tecnicoMatricula = [tecnicoMatricula];
    } else {
      return res.status(400).json({
        status: false,
        message: "Envie uma ou mais matrículas válidas.",
      });
    }
  }

  if (tecnicoMatricula.length === 0) {
    return res.status(400).json({
      status: false,
      message: "A lista de técnicos não pode estar vazia.",
    });
  }

  const ordem = await prisma.ordem.findUnique({
    where: { numeroOs },
    include: { tecnico: true },
  });

  if (!ordem)
    return res.status(403).json({
      status: false,
      message: "OS não encontrada ou foi excluída",
    });

  // Verifica quais técnicos realmente estão vinculados
  const tecnicosVinculados = ordem.tecnico.map((t) => t.matricula);
  const naoVinculados = tecnicoMatricula.filter(
    (matricula) => !tecnicosVinculados.includes(matricula)
  );

  if (naoVinculados.length > 0) {
    return res.status(400).json({
      status: false,
      message: `Os técnico(s) ${naoVinculados.join(
        ", "
      )} não estão vinculados na OS.`,
    });
  }

  const removido = await prisma.ordem.update({
    where: { numeroOs },
    data: {
      tecnico: {
        disconnect: tecnicoMatricula.map((matricula) => ({ matricula })),
      },
    },
    include: {
      tecnico: {
        select: { nome: true, matricula: true },
      },
    },
  });

  return res.status(200).json({
    status: true,
    message: "Técnico(s) removido(s) com sucesso.",
    data: removido.tecnico,
  });
};

export const trocarSupervisorNaOs = async (req, res) => {
  const { numeroOs } = req.params;
  const { supervisorMatricula } = req.body;
  console.log(supervisorMatricula);
  const ordem = await prisma.ordem.findUnique({
    where: { numeroOs },
    include: { supervisor: true },
  });

  if (!ordem)
    return res
      .status(403)
      .json({ status: false, message: "OS não encontrada ou foi excluída" });

  const supervisor = await prisma.funcionario.findUnique({
    where: { matricula: supervisorMatricula },
  });

  if (!supervisor || supervisor.nivelAcesso !== "SUPERVISOR")
    return res.status(401).json({
      status: false,
      message: "Matrícula informada inválida ou não pertence a um supervisor.",
    });

  const atualMatricula = ordem.supervisor?.matricula;

  if (atualMatricula === supervisorMatricula)
    return res.status(401).json({
      status: false,
      message: "Supervisor informado já está vinculado.",
    });

  await prisma.ordem.update({
    where: { numeroOs },
    data: {
      supervisor: {
        connect: { matricula: supervisorMatricula },
      },
    },
  });

  return res
    .status(200)
    .json({ status: true, message: "Supervisor alterado com sucesso." });
};

export const atualizaStatusOs = async (req, res) => {
  const { numeroOs } = req.params;
  const { status } = req.body;
  await prisma.ordem.update({
    where: { numeroOs },
    data: {
      status,
    },
  });

  return res
    .status(200)
    .json({ status: true, message: "Status atualizado com sucesso." });
};

export const adicionarSubestacao = async (req, res) => {
  const data = req.body;
  const { matricula, numeroOs } = req.params;
  const { funcionarioMatricula, funcionarioNivelAcesso } = req;

  if (!conferirMatriculas(matricula, funcionarioMatricula))
    return res.status(403).json({ status: false, message: "Acesso negado." });

  if (funcionarioNivelAcesso.toString().toUpperCase() === "TECNICO")
    return res.status(403).json({
      status: false,
      message: "Você não para adicionar uma subestação.",
    });

  const subestacaoExist = await prisma.subestacao.findFirst({
    where: {
      ordemOs: numeroOs,
      nome: data.nome,
    },
  });

  if (subestacaoExist)
    return res.status(403).json({
      status: false,
      message: `Subestação já está vinculada na OS ${subestacaoExist.ordemOs}`,
    });

  await prisma.subestacao.create({
    data: {
      nome: data.nome,
      ordemOs: numeroOs,
    },
  });

  return res
    .status(201)
    .json({ status: false, message: "Subestação cadastrada com sucesso." });
};

export const listarSubestacao = async (req, res) => {
  const { matricula, numeroOs } = req.params;
  const { funcionarioMatricula, funcionarioNivelAcesso } = req;

  if (!conferirMatriculas(matricula, funcionarioMatricula))
    return res.status(403).json({ status: false, message: "Acesso negado." });

  if (funcionarioNivelAcesso.toString().toUpperCase() === "TECNICO")
    return res.status(403).json({
      status: false,
      message: "Você não para adicionar uma subestação.",
    });

  const subestacaoExist = await prisma.subestacao.findMany({
    where: {
      ordemOs: numeroOs,
    },
  });

  if (!subestacaoExist)
    return res.status(403).json({
      status: false,
      message: `No momento não possui subestação vinculada na OS ${numeroOs}`,
    });

  return res.status(200).json({
    status: true,
    message:
      subestacaoExist.length > 0
        ? "Subestações localizadas."
        : "No momento não possui subestação vinculada na OS",
    data: subestacaoExist,
  });
};

export const removerSubestacao = async (req, res) => {
  const { matricula, numeroOs, subestacaoId } = req.params;
  const { funcionarioMatricula, funcionarioNivelAcesso } = req;

  if (!conferirMatriculas(matricula, funcionarioMatricula))
    return res.status(403).json({ status: false, message: "Acesso negado." });

  if (funcionarioNivelAcesso.toString().toUpperCase() === "TECNICO")
    return res.status(403).json({
      status: false,
      message: "Você não permissão para remover uma subestação.",
    });

  const subestacaoExist = await prisma.subestacao.findFirst({
    where: {
      id: Number(subestacaoId),
      ordemOs: numeroOs,
    },
  });

  if (!subestacaoExist)
    return res.status(403).json({
      status: false,
      message: `Não foi localizada subestação vinculada na OS ${numeroOs}`,
    });

  // 🪵 Registrar log
  await prisma.logAtividade.create({
    data: {
      acao: "EXCLUIR",
      entidade: "subestação",
      dadosAfetados: subestacaoExist,
      feitoPor: Number(matricula),
    },
  });

  await prisma.subestacao.delete({
    where: {
      id: Number(subestacaoId),
    },
  });

  return res
    .status(201)
    .json({ status: false, message: "Subestação excluída com sucesso." });
};

export const atualizarDadosSubestação = async (req, res) => {
  const { matricula, numeroOs, subestacaoId } = req.params;
  const { funcionarioMatricula, funcionarioNivelAcesso } = req;
  const data = req.body;

  if (!conferirMatriculas(matricula, funcionarioMatricula))
    return res.status(403).json({ status: false, message: "Acesso negado." });

  if (funcionarioNivelAcesso.toString().toUpperCase() === "TECNICO")
    return res.status(403).json({
      status: false,
      message: "Você não para atualizar uma subestação.",
    });

  const subestacaoExist = await prisma.subestacao.findFirst({
    where: {
      id: Number(subestacaoId),
      ordemOs: numeroOs,
    },
  });

  if (!subestacaoExist)
    return res.status(403).json({
      status: false,
      message: `Não foi localizada a subestação vinculada na OS ${numeroOs}`,
    });

  await prisma.subestacao.update({
    where: { id: Number(subestacaoId) },
    data,
  });

  return res
    .status(200)
    .json({ status: true, message: "Dados da subestação atualizada." });
};

export const detalharOrdemFuncionario = async (req, res) => {
  const { numeroOs, matricula } = req.params;
  const nivelAcesso = req.funcionarioNivelAcesso;

  if (!conferirMatriculas(Number(matricula), req.funcionarioMatricula))
    return res.status(403).json({ status: false, message: "Acesso negado." });

  const ordem = await prisma.ordem.findUnique({
    where: { numeroOs },
    include: { tecnico: true, supervisor: true, subestacoes: true },
  });

  if (!ordem) {
    return res.status(404).json({
      status: false,
      message: "Ordem de serviço não localizada ou não existe.",
    });
  }

  if (
    nivelAcesso !== "ADMIN" &&
    ordem.supervisorMatricula !== Number(matricula) &&
    !ordem.tecnico.some((t) => t.matricula === Number(matricula))
  ) {
    return res
      .status(403)
      .json({ status: false, message: "Acesso negado à ordem." });
  }

  return res.status(200).json({ status: true, data: ordem });
};

export const listarComponentesDaOrdem = async (req, res) => {
  const { numeroOs, matricula } = req.params;
  const nivelAcesso = req.funcionarioNivelAcesso;

  if (!conferirMatriculas(Number(matricula), req.funcionarioMatricula))
    return res.status(403).json({ status: false, message: "Acesso negado." });

  const ordem = await prisma.ordem.findUnique({
    where: { numeroOs },
    include: {
      tecnico: true,
      supervisor: true,
      componente: true,
    },
  });

  if (!ordem)
    return res
      .status(404)
      .json({ status: false, message: "Ordem não encontrada." });

  if (
    nivelAcesso !== "ADMIN" &&
    ordem.supervisorMatricula !== Number(matricula) &&
    !ordem.tecnico.some((t) => t.matricula === Number(matricula))
  ) {
    return res
      .status(403)
      .json({ status: false, message: "Acesso negado à ordem." });
  }

  return res.status(200).json({ status: true, data: ordem.componente });
};

export const buscarFuncionarioPorMatricula = async (req, res) => {
  const { matricula, outraMatricula } = req.params;
  const nivelAcesso = req.funcionarioNivelAcesso;

  if (!conferirMatriculas(Number(matricula), req.funcionarioMatricula))
    return res.status(403).json({ status: false, message: "Acesso negado." });

  if (nivelAcesso !== "ADMIN" && nivelAcesso !== "SUPERVISOR") {
    return res.status(403).json({ status: false, message: "Acesso restrito." });
  }

  const funcionario = await prisma.funcionario.findFirst({
    where: { matricula: Number(outraMatricula) },
  });

  if (!funcionario) {
    return res
      .status(404)
      .json({ status: false, message: "Funcionário não encontrado." });
  }

  const { senha, ...rest } = funcionario;
  return res.status(200).json({
    status: true,
    data: nivelAcesso === "SUPERVISOR" ? rest : funcionario,
  });
};

export const adicionarComponente = async (req, res) => {
  const data = req.body;
  const { matricula, numeroOs, subestacaoId } = req.params;
  const { funcionarioMatricula, funcionarioNivelAcesso } = req;

  // Se não der certo, redirecionar para o login e deslogar
  if (!conferirMatriculas(matricula, req.funcionarioMatricula))
    return res.status(403).json({ status: false, message: "Acesso negado." });

  const osVinculada = await prisma.ordem.findFirst({
    where: { numeroOs },
    select: { tecnico: true },
  });
  if (!osVinculada)
    return res
      .status(403)
      .json({ status: false, message: "OS não existe ou foi excluída." });

  if (
    !osVinculada.tecnico.includes(funcionarioMatricula) &&
    funcionarioNivelAcesso === "TECNICO"
  )
    return res.status(401).json({
      status: false,
      message: "Acesso negado, técnico não vinculado à OS ou não autorizado.",
    });

  const subestacaoExiste = await prisma.subestacao.findUnique({
    where: { id: Number(subestacaoId) },
  });

  if (!subestacaoExiste)
    return res.status(403).json({
      status: false,
      message: "Subestação não existe ou foi excluída.",
    });

  const componenteExiste = await prisma.componente.findFirst({
    where: {
      numeroSerie: data.numeroSerie,
      subestacaoId: Number(subestacaoId),
    },
  });

  if (componenteExiste)
    return res.status(403).json({
      status: false,
      message: `Já existe o componente com esse número de série vinculado na subestação.`,
    });
  const componenteCriado = await prisma.componente.create({
    data: {
      ...data,
      subestacao: { connect: { id: Number(subestacaoId) } },
    },
  });

  return res.status(201).json({
    status: false,
    message: "Componente cadastrado com sucesso.",
    data: componenteCriado,
  });
};

export const atualizarComponente = async (req, res) => {
  const { matricula, numeroOs, subestacaoId, componenteId } = req.params;
  const { funcionarioMatricula, funcionarioNivelAcesso } = req;
  const data = req.body;

  // Se não der certo, redirecionar para o login e deslogar
  if (!conferirMatriculas(matricula, funcionarioMatricula))
    return res.status(403).json({ status: false, message: "Acesso negado." });

  const osVinculada = await prisma.ordem.findFirst({
    where: { numeroOs },
    include: {
      tecnico: true,
    },
  });

  if (
    !osVinculada.tecnico.includes(funcionarioMatricula) &&
    funcionarioNivelAcesso === "TECNICO"
  )
    return res.status(401).json({
      status: false,
      message: "Acesso negado, técnico não vinculado à OS ou não autorizado.",
    });

  const componenteExiste = await prisma.componente.findFirst({
    where: { id: Number(componenteId), subestacaoId: Number(subestacaoId) },
  });
  if (!componenteExiste)
    return res.status(400).json({
      status: false,
      message: "Componente não encontrado ou foi excluído",
    });

  await prisma.componente.update({
    where: { id: Number(componenteId) },
    data: {
      ...data,
    },
  });

  return res
    .status(200)
    .json({ status: true, message: "Componente atualizado com sucesso." });
};

export const excluirComponenteNaOs = async (req, res) => {
  const { matricula, subestacaoId, componenteId } = req.params;
  const { funcionarioMatricula, funcionarioNivelAcesso } = req;

  // Se não der certo, redirecionar para o login e deslogar
  if (!conferirMatriculas(matricula, funcionarioMatricula))
    return res.status(403).json({ status: false, message: "Acesso negado." });

  if (funcionarioNivelAcesso !== "ADMIN")
    return res.status(401).json({
      status: false,
      message: "Acesso negado, técnico não vinculado à OS ou não autorizado.",
    });

  const componenteExist = await prisma.componente.findFirst({
    where: { id: Number(componenteId), subestacaoId: Number(subestacaoId) },
    include: { subestacao: true },
  });

  if (!componenteExist)
    return res.status(400).json({
      status: false,
      message: "Componente não está vinculado na OS ou foi excluído.",
    });

  await prisma.componente.delete({ where: { id: Number(componenteId) } });

  // 🪵 Registrar log
  await prisma.logAtividade.create({
    data: {
      acao: "EXCLUIR",
      entidade: "componente",
      dadosAfetados: componenteExist,
      feitoPor: Number(matricula),
    },
  });
  return res
    .status(200)
    .json({ status: true, message: "Componente foi excluído com sucesso." });
};

export const adicionarEnsaioComponente = async (req, res) => {
  const { funcionarioMatricula, funcionarioNivelAcesso } = req;
  const componenteId = Number(req.params.componenteId);
  const { matricula, numeroOs, subestacaoId } = req.params;
  const data = req.body;

  // Se não der certo, redirecionar para o login e deslogar
  if (!conferirMatriculas(matricula, funcionarioMatricula))
    return res.status(403).json({ status: false, message: "Acesso negado." });

  const componenteEnsaiado = await prisma.componente.findUnique({
    where: { id: componenteId },
    include: {
      subestacao: true,
    },
  });

  const subestacaoComponenteEnsaiado = await prisma.subestacao.findFirst({
    where: { ordemOs: numeroOs },
    include: {
      ordem: {
        include: { supervisor: true, tecnico: true },
      },
    },
  });

  if (!componenteEnsaiado || !subestacaoComponenteEnsaiado)
    return res.status(400).json({
      status: false,
      message: "Componente ou OS informada inválida.",
    });

  if (componenteEnsaiado.subestacao.ordemOs !== numeroOs)
    return res.status.json({
      status: false,
      message: "Componente não pertence à subestação informada.",
    });

  if (componenteEnsaiado.tipo.toLocaleUpperCase() === "TRAFO_CORRENTE") {
    const jaExiste = await prisma.ensaioTrafoCorrente.findUnique({
      where: { componenteID: componenteId },
    });

    if (jaExiste)
      return res.status(400).json({
        status: false,
        message: "Já existe um ensaio registrado para este trafo.",
      });

    if (funcionarioNivelAcesso === "TECNICO") {
      const tecnicoVinculado = subestacaoComponenteEnsaiado.ordem.tecnico.some(
        (t) => t.matricula === funcionarioMatricula
      );

      if (!tecnicoVinculado) {
        return res.status(403).json({
          status: false,
          message: "Técnico não está vinculado à OS.",
        });
      }
    }

    if (funcionarioNivelAcesso === "SUPERVISOR") {
      const supervisorOuTecnico =
        ordem.supervisor?.matricula === funcionarioMatricula ||
        ordem.tecnico.some((t) => t.matricula === funcionarioMatricula);

      if (!supervisorOuTecnico) {
        return res.status(403).json({
          status: false,
          message: "Supervisor não está vinculado à OS.",
        });
      }
    }

    const ensaio = await prisma.ensaioTrafoCorrente.create({
      data: {
        ...data,
        responsavelEnsaioMatricula: funcionarioMatricula,
        componente: {
          connect: { id: componenteId },
        },
      },
    });

    return res.status(201).json({
      status: true,
      message: "Ensaio registrado com sucesso.",
      data: ensaio,
    });
  }
};

export const excluirEnsaioComponente = async (req, res) => {
  const { funcionarioMatricula, funcionarioNivelAcesso } = req;
  const { matricula, subestacaoId, componenteId, ensaioId } = req.params;

  // Se não der certo, redirecionar para o login e deslogar
  if (!conferirMatriculas(matricula, funcionarioMatricula))
    return res.status(403).json({ status: false, message: "Acesso negado." });

  if (funcionarioNivelAcesso.toString().toUpperCase() !== "ADMIN")
    return res.status(401).json({
      status: false,
      message: "Acesso negado, técnico não vinculado à OS ou não autorizado.",
    });

  const ensaioFeito = await prisma.ensaioTrafoCorrente.findUnique({
    where: { id: Number(ensaioId) },
  });

  if (!ensaioFeito || ensaioFeito.componenteID !== Number(componenteId))
    return res.status(400).json({
      status: false,
      message: "Ensaio não está vinculado no componente ou foi excluído.",
    });

  const componenteEnsaiado = await prisma.componente.findUnique({
    where: { id: Number(componenteId) },
    include: { subestacao: true },
  });

  if (componenteEnsaiado.subestacao.id !== Number(subestacaoId))
    return res.status(400).json({
      status: false,
      message: "Componente não está vinculado na OS ou foi excluído.",
    });

  await prisma.ensaioTrafoCorrente.delete({ where: { id: Number(ensaioId) } });

  // 🪵 Registrar log
  await prisma.logAtividade.create({
    data: {
      acao: "EXCLUIR",
      entidade: "ensaioTrafoCorrente",
      dadosAfetados: ensaioFeito,
      feitoPor: Number(matricula),
    },
  });

  return res.status(200).json({
    status: true,
    message: "Ensaio foi excluído do componente com sucesso.",
  });
};

export const listarLogs = async (req, res) => {
  const { funcionarioNivelAcesso } = req;

  if (funcionarioNivelAcesso !== "ADMIN")
    return res.status(403).json({ status: false, message: "Acesso restrito." });

  const logs = await prisma.logAtividade.findMany({
    orderBy: { criadoEm: "desc" },
  });

  return res.status(200).json({ status: true, data: logs });
};

export const cadastrarEquipamento = async (req, res) => {
  const data = req.body;
  const { matricula } = req.params;
  const { funcionarioMatricula, funcionarioNivelAcesso } = req;

  if (!conferirMatriculas(matricula, funcionarioMatricula))
    return res.status(403).json({ status: false, message: "Acesso negado." });

  if (funcionarioNivelAcesso.toString().toUpperCase() !== "ADMIN")
    return res.status(403).json({
      status: false,
      message: "Você não tem permissão para cadastrar equipamento.",
    });

  const equipamentoExiste = await prisma.equipamento.findFirst({
    where: { numeroSerie: data.numeroSerie },
  });

  if (equipamentoExiste)
    return res.status(401).json({
      status: false,
      message: "Número de série já existe cadastrado em outro equipamento.",
    });

  await prisma.equipamento.create({
    data: {
      nome: data.nome,
      descricao: data.descricao,
      modelo: data.modelo,
      numeroSerie: data.numeroSerie,
    },
  });

  return res
    .status(201)
    .json({ status: true, message: "Equipamento cadastrado com sucesso." });
};

export const atualizarEquipamento = async (req, res) => {
  const data = req.body;
  const { matricula, equipamentoId } = req.params;
  const { funcionarioMatricula, funcionarioNivelAcesso } = req;

  if (!conferirMatriculas(matricula, funcionarioMatricula))
    return res.status(403).json({ status: false, message: "Acesso negado." });

  if (funcionarioNivelAcesso.toString().toUpperCase() !== "ADMIN")
    return res.status(403).json({
      status: false,
      message: "Você não tem permissão para atuallizar dados do equipamento.",
    });

  const equipamentoExiste = await prisma.equipamento.findFirst({
    where: { id: Number(equipamentoId) },
  });

  if (!equipamentoExiste)
    return res.status(401).json({
      status: false,
      message: "Equipamento informado não existe ou foi excluído.",
    });

  await prisma.equipamento.update({
    where: { id: Number(equipamentoId) },
    data,
  });

  return res
    .status(200)
    .json({ status: true, message: "Equipamento atualizado com sucesso." });
};

export const listarEquipamentos = async (req, res) => {
  const { matricula } = req.params;
  const { funcionarioMatricula } = req;

  if (!conferirMatriculas(matricula, funcionarioMatricula))
    return res.status(403).json({ status: false, message: "Acesso negado." });

  const equipamentoExiste = await prisma.equipamento.findMany({});

  if (!equipamentoExiste)
    return res.status(401).json({
      status: false,
      message: "Equipamento informado não existe ou foi excluído.",
    });

  return res.status(200).json({
    statue: true,
    message:
      equipamentoExiste.length > 0
        ? "Equipamentos encontrados."
        : "No momento não existe equipamento cadastrado.",
    data: equipamentoExiste,
  });
};

export const excluirEquipamento = async (req, res) => {
  const { matricula, equipamentoId } = req.params;
  const { funcionarioMatricula, funcionarioNivelAcesso } = req;

  if (!conferirMatriculas(matricula, funcionarioMatricula))
    return res.status(403).json({ status: false, message: "Acesso negado." });

  if (funcionarioNivelAcesso.toString().toUpperCase() !== "ADMIN")
    return res.status(403).json({
      status: false,
      message: "Você não tem permissão para excluir equipamento.",
    });

  const equipamentoExiste = await prisma.equipamento.findFirst({
    where: { id: Number(equipamentoId) },
  });

  if (!equipamentoExiste)
    return res.status(401).json({
      status: false,
      message: "Equipamento informado não existe ou foi excluído.",
    });

  await prisma.equipamento.delete({ where: { id: Number(equipamentoId) } });

  // 🪵 Registrar log
  await prisma.logAtividade.create({
    data: {
      acao: "EXCLUIR",
      entidade: "equipamento",
      dadosAfetados: equipamentoExiste,
      feitoPor: Number(matricula),
    },
  });

  return res.status(200).json({
    statue: true,
    message: "Equipamento excluído com sucesso.",
  });
};
