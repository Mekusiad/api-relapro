import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import { conferirMatriculas } from "../utils/conferirMatriculas.js";
import { listarOrdensDoFuncionarioSchema } from "../validations/schema.js";
import { gerarUsuarioAutomatico } from "../utils/utils.js";
const prisma = new PrismaClient();

export const atualizarDadosPrincipaisOs = async (req, res) => {
  const {
    params: { numeroOs },
    body: osDataFromFrontend,
  } = req.validatedData;

  try {
    // A transação garante que todas as operações sejam bem-sucedidas, ou nenhuma delas.
    await prisma.$transaction(async (tx) => {
      // ETAPA 1: ATUALIZA OS DADOS PRINCIPAIS DA OS
      await tx.ordem.update({
        where: { numeroOs },
        data: {
          cliente: osDataFromFrontend.cliente,
          nomeResponsavel: osDataFromFrontend.nomeResponsavel,
          localServico: osDataFromFrontend.localServico,
          email: osDataFromFrontend.email,
          contato: osDataFromFrontend.contato,
          numeroOrcamento: osDataFromFrontend.numeroOrcamento,
          tipoServico: osDataFromFrontend.tipoServico,
          previsaoInicio: osDataFromFrontend.previsaoInicio,
          status: osDataFromFrontend.status,
          descricaoInicial: osDataFromFrontend.descricaoInicial,
          observacoes: osDataFromFrontend.observacoes,
          tecnico: {
            set: osDataFromFrontend.tecnico.map((matricula) => ({
              matricula,
            })),
          },
          supervisor: {
            connect: { matricula: osDataFromFrontend.supervisor },
          },
        },
      });

      // ETAPA 2: SINCRONIZA AS SUBESTAÇÕES E SEUS COMPONENTES

      // Primeiro, identifica e DELETA as subestações que não estão mais no formulário
      const idsDoFrontend = osDataFromFrontend.subestacoes
        .map((s) => s.id)
        .filter((id) => !String(id).startsWith("temp_"))
        .map(Number);

      await tx.subestacao.deleteMany({
        where: {
          ordemOs: numeroOs,
          id: { notIn: idsDoFrontend },
        },
      });

      // Agora, percorre os dados do formulário para ATUALIZAR as existentes ou CRIAR as novas
      for (const subFromFrontend of osDataFromFrontend.subestacoes) {
        // Prepara a lista de componentes a serem criados, respeitando a quantidade
        const componentesParaCriar = (
          subFromFrontend.componentes || []
        ).flatMap((comp) =>
          Array.from({ length: comp.quantidade }).map(() => ({
            nomeEquipamento: comp.nomeEquipamento,
            tipo: comp.tipo,
            numeroSerie: comp.numeroSerie || "N/A",
            fabricante: comp.fabricante || "N/A",
          }))
        );

        if (String(subFromFrontend.id).startsWith("temp_")) {
          await tx.subestacao.create({
            data: {
              nome: subFromFrontend.nome,
              observacoesTecnicasSubestacao:
                subFromFrontend.observacoesTecnicasSubestacao,
              ordem: { connect: { numeroOs: numeroOs } },

              componentes: {
                create: componentesParaCriar,
              },
            },
          });
        } else {
          const subestacaoId = Number(subFromFrontend.id);

          await tx.subestacao.update({
            where: { id: subestacaoId },
            data: {
              nome: subFromFrontend.nome,
              observacoesTecnicasSubestacao:
                subFromFrontend.observacoesTecnicasSubestacao,
            },
          });

          const componentesAtuaisNoDB = await tx.componente.findMany({
            where: { subestacaoId: subestacaoId },
          });

          const nomesNoForm = subFromFrontend.componentes.map(
            (c) => c.nomeEquipamento
          );
          const componentesParaRemoverTotalmente = componentesAtuaisNoDB
            .filter((c) => !nomesNoForm.includes(c.nomeEquipamento))
            .map((c) => c.id);

          if (componentesParaRemoverTotalmente.length > 0) {
            await tx.componente.deleteMany({
              where: { id: { in: componentesParaRemoverTotalmente } },
            });
          }

          for (const compInfo of subFromFrontend.componentes) {
            const compsAtuaisDoTipo = componentesAtuaisNoDB.filter(
              (c) => c.nomeEquipamento === compInfo.nomeEquipamento
            );
            const qtdAtual = compsAtuaisDoTipo.length;
            const qtdDesejada = compInfo.quantidade;

            if (qtdDesejada > qtdAtual) {
              const aAdicionar = qtdDesejada - qtdAtual;
              for (let i = 0; i < aAdicionar; i++) {
                await tx.componente.create({
                  data: {
                    nomeEquipamento: compInfo.nomeEquipamento,
                    tipo: compInfo.tipo,
                    subestacaoId: subestacaoId,
                    numeroSerie: "N/A",
                    fabricante: "N/A",
                  },
                });
              }
            } else if (qtdDesejada < qtdAtual) {
              const aDeletar = qtdAtual - qtdDesejada;
              const idsParaDeletar = compsAtuaisDoTipo
                .slice(0, aDeletar)
                .map((c) => c.id);

              if (idsParaDeletar.length > 0) {
                await tx.componente.deleteMany({
                  where: { id: { in: idsParaDeletar } },
                });
              }
            }
          }
        }
      }
    });

    return res.json({
      status: true,
      message: "Ordem de Serviço atualizada com sucesso.",
    });
  } catch (error) {
    console.error("Erro ao atualizar OS:", error);
    return res.status(500).json({
      status: false,
      message: "Falha ao atualizar a Ordem de Serviço.",
      error: error.message,
    });
  }
};

export const homeInfo = async (req, res) => {
  const decodedMatricula = req.validatedData.funcionarioMatricula;

  const funcionario = await prisma.funcionario.findFirst({
    where: { matricula: decodedMatricula },
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
          supervisorMatricula: funcionario.matricula,
        },
        {
          tecnico: {
            some: {
              matricula: funcionario.matricula,
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
          matricula: funcionario.matricula,
        },
      },
    };
  }
  // Carrega estatísticas baseadas no filtro
  const [totalOs, abertas, andamento, finalizadas, ordens] = await Promise.all([
    prisma.ordem.count(),
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
    totalOs,
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
  const novoUsuario = gerarUsuarioAutomatico(data.nome);
  const usuarioExiste = await prisma.funcionario.findFirst({
    where: { usuario: novoUsuario },
  });
  if (usuarioExiste)
    return res
      .status(400)
      .json({ status: false, message: "Usuário existente, tente outra." });

  await prisma.funcionario.create({
    data: {
      nome: data.nome,
      usuario: data?.usuario || novoUsuario,
      matricula: data.matricula,
      cargo: data.cargo,
      admissao: new Date(),
      senha: data.senha,
      nivelAcesso: data.nivelAcesso || "TECNICO",
    },
  });

  return res
    .status(201)
    .json({ status: false, message: "Funcionário cadastrado com sucesso." });
};

export const atualizarDadosFuncionario = async (req, res) => {
  const outraMatricula = req.params.outraMatricula;
  const data = req.validatedData;
  console.log(data);
  // Criptografa a senha se estiver presente
  if (data.senha) {
    const saltRounds = 10;
    data.senha = await bcrypt.hash(data.senha, saltRounds);
  }

  const dadosAtualizados = await prisma.funcionario.update({
    where: { matricula: outraMatricula },
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
    where: { matricula: outraMatricula },
  });

  if (!funcionarioExcluido)
    return res
      .status(404)
      .json({ status: false, message: "Funcionário não encontrado." });

  await prisma.funcionario.delete({
    where: { matricula: outraMatricula },
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
  const { funcionarioNivelAcesso } = req;
  const funcionarios = await prisma.funcionario.findMany({
    orderBy: {
      nome: "asc",
    },
    select: {
      id: true,
      nome: true,
      usuario: true,
      matricula: true,
      cargo: true,
      nivelAcesso: true,
      createdAt: true,
    },
  });

  const data =
    funcionarioNivelAcesso !== "ADMIN"
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

  const ordens = await prisma.ordem.findMany({
    where,
    orderBy: {
      createdAt: "desc",
    },
    take: limit,
    skip,
    include: {
      tecnico: {
        select: { nome: true, matricula: true },
      },
      supervisor: { select: { nome: true, matricula: true } },
      subestacoes: {
        include: {
          componentes: { include: { ensaio: true } },
        },
      },
    },
  });

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

// Criar O.S 2.0

export const criarOs2 = async (req, res) => {
  const data = req.validatedData;
  console.log("Entrou no criarOs2");
  console.log(JSON.stringify(data));
  const previsaoInicioDate = new Date(data.previsaoInicio);

  // Verifica se já existe uma OS com mesmo cliente, local e data
  const ordemExist = await prisma.ordem.findFirst({
    where: {
      cliente: data.cliente,
      localServico: data.localServico,
      previsaoInicio: previsaoInicioDate,
    },
  });

  if (ordemExist) {
    return res.status(403).json({
      status: false,
      message: `Serviço já existe e está vinculada à OS ${ordemExist.numeroOs}`,
    });
  }

  // Verifica se número de orçamento já existe
  const numeroOrcamentoExist = await prisma.ordem.findFirst({
    where: {
      numeroOrcamento: data.numeroOrcamento,
    },
  });

  if (numeroOrcamentoExist) {
    return res.status(403).json({
      status: false,
      message: `Número de orçamento já existe e está vinculado à OS ${numeroOrcamentoExist.numeroOs}`,
    });
  }

  // Valida supervisor
  const supervisorExiste = await prisma.funcionario.findUnique({
    where: { matricula: data.supervisor },
  });

  if (!supervisorExiste) {
    return res.status(404).json({
      status: false,
      message: `Supervisor com matrícula ${data.supervisor} não encontrado.`,
    });
  }

  // Valida técnicos
  if (data.tecnico && data.tecnico.length > 0) {
    const tecnicos = await prisma.funcionario.findMany({
      where: { matricula: { in: data.tecnico.map(String) } },
    });

    if (tecnicos.length !== data.tecnico.length) {
      const encontrados = tecnicos.map((t) => t.matricula);
      const naoEncontrados = data.tecnico.filter(
        (m) => !encontrados.includes(m)
      );

      return res.status(404).json({
        status: false,
        message: `Técnico(s) não encontrado(s): ${naoEncontrados.join(", ")}`,
      });
    }
  }

  // Gera número da OS sequencial
  const now = new Date();
  const ano = now.getFullYear();
  const countAno = await prisma.ordem.count({
    where: {
      createdAt: {
        gte: new Date(`${ano}-01-01T00:00:00.000Z`),
        lt: new Date(`${ano + 1}-01-01T00:00:00.000Z`),
      },
    },
  });

  const numeroSequencial = String(countAno + 1).padStart(3, "0");
  const numeroOs = `${ano}${numeroSequencial}`;

  // Cria ordem
  const novaOrdem = await prisma.ordem.create({
    data: {
      numeroOs,
      cliente: data.cliente,
      nomeResponsavel: data.nomeResponsavel,
      tipoServico: data.tipoServico,
      numeroOrcamento: data.numeroOrcamento,
      contato: data.contato,
      email: data.email,
      observacoes: data.observacoes,
      localServico: data.localServico,
      descricaoInicial: data.descricaoInicial,
      previsaoInicio: previsaoInicioDate,
      supervisor: {
        connect: { matricula: String(data.supervisor) },
      },
      ...(data?.tecnico?.length > 0 && {
        tecnico: {
          connect: data.tecnico.map((matricula) => ({
            matricula: String(matricula),
          })),
        },
      }),
      status: data.status || "ABERTA",
    },
    include: {
      supervisor: { select: { nome: true, matricula: true } },
      tecnico: { select: { nome: true, matricula: true } },
    },
  });

  // Cria subestações e componentes

  const subestacoesCriadas = await Promise.all(
    (data.subestacoes || []).map(async (sub) => {
      return prisma.subestacao.create({
        data: {
          nome: sub.nome,
          ordemOs: novaOrdem.numeroOs,
          componentes: {
            create:
              sub.componentes?.map((comp) => ({
                ...comp,
                quantidade: comp.quantidade ?? 1,
              })) || [],
          },
        },
        include: {
          componentes: true,
        },
      });
    })
  );

  return res.status(201).json({
    status: true,
    message: "OS criada com sucesso.",
    data: {
      ...novaOrdem,
      subestacoes: subestacoesCriadas,
    },
  });
};

//  Fim

export const criarOs = async (req, res) => {
  const data = req.validatedData;
  const previsaoInicioDate = new Date(data.previsaoInicio);
  console.log(data);
  const ordemExist = await prisma.ordem.findFirst({
    where: {
      cliente: data.cliente,
      localServico: data.localServico,
      previsaoInicio: previsaoInicioDate,
    },
  });

  console.log("->", ordemExist);
  if (ordemExist)
    return res.status(403).json({
      status: false,
      message: `Serviço já existe e está vinculada à OS ${ordemExist.numeroOs}`,
    });

  const numeroOrcamentoExist = await prisma.ordem.findFirst({
    where: {
      numeroOrcamento: data.numeroOrcamento,
    },
  });

  if (numeroOrcamentoExist)
    return res.status(403).json({
      status: false,
      message: `Número de orçamento já existe e está vinculada à OS ${numeroOrcamentoExist.numeroOs}`,
    });

  const supervisorExiste = await prisma.funcionario.findUnique({
    where: { matricula: data.supervisorMatricula },
  });

  if (!supervisorExiste) {
    return res.status(404).json({
      status: false,
      message: `Supervisor com matrícula ${data.supervisorMatricula} não encontrado.`,
    });
  }

  if (data.tecnicoMatricula && data.tecnicoMatricula.length > 0) {
    const tecnicos = await prisma.funcionario.findMany({
      where: { matricula: { in: data.tecnicoMatricula.map(String) } },
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
  const countAno = await prisma.ordem.count({
    where: {
      createdAt: {
        gte: new Date(`${ano}-01-01T00:00:00.000Z`),
        lt: new Date(`${ano + 1}-01-01T00:00:00.000Z`),
      },
    },
  });
  const numeroSequencial = String(countAno + 1).padStart(3, "0");
  const numberOs = `${ano}${numeroSequencial}`;

  const novaOrdem = await prisma.ordem.create({
    data: {
      numeroOs: numberOs,
      cliente: data.cliente,
      nomeResponsavel: data.nomeResponsavel,
      tipoServico: data.tipoServico,
      numeroOrcamento: data.numeroOrcamento,
      contato: data.contato,
      email: data.email,
      observacoes: data.observacoes,
      localServico: data.localServico,
      descricaoInicial: data.descricaoInicial,
      previsaoInicio: previsaoInicioDate,
      supervisor: {
        connect: { matricula: String(data.supervisorMatricula) },
      },
      ...(data.tecnicoMatricula &&
        data.tecnicoMatricula.length > 0 && {
          tecnico: {
            connect: data.tecnicoMatricula.map((matricula) => ({
              matricula: String(matricula),
            })),
          },
        }),
      status: data.status || "ABERTA",
    },
    include: {
      supervisor: { select: { nome: true, matricula: true } },
      tecnico: { select: { nome: true, matricula: true } },
    },
  });

  return res
    .status(201)
    .json({ status: true, message: "OS criada com sucesso.", data: novaOrdem });
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
      feitoPor: matricula,
    },
  });

  return res
    .status(200)
    .json({ status: true, message: "OS excluída com sucesso." });
};

export const adicionarSubestacao = async (req, res) => {
  console.log("Entrou no adicionarSubestacao");
  const { params, body } = req.validatedData;
  const { numeroOs } = params;
  const { nome } = body;

  const subestacaoExist = await prisma.subestacao.findFirst({
    where: {
      ordemOs: numeroOs,
      nome: nome,
    },
  });

  if (subestacaoExist) {
    return res.status(403).json({
      status: false,
      message: `Subestação com nome '${nome}' já está vinculada na OS ${numeroOs}`,
    });
  }

  const novaSubestacao = await prisma.subestacao.create({
    data: {
      nome: nome,
      ordemOs: numeroOs,
    },
  });

  return res.status(201).json({
    status: true,
    message: "Subestação cadastrada com sucesso.",
    data: novaSubestacao,
  });
};

export const criarSubestacaoComComponente = async (req, res) => {
  try {
    const { matricula, ordemOs } = req.params;
    const { componentes } = req.body;

    const novaSubestacao = await prisma.subestacao.create({
      data: {
        ordemOs,
        componentes: {
          create: componentes, // já vem expandido do frontend
        },
      },
    });

    return res.status(201).json(novaSubestacao);
  } catch (err) {
    console.error("Erro ao criar subestação:", err);
    return res.status(500).json({ error: "Erro ao criar subestação" });
  }
};

export const listarSubestacao = async (req, res) => {
  const { numeroOs } = req.validatedData;

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
  const { matricula, numeroOs, subestacaoId } = req.validatedData;

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
      feitoPor: matricula,
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
  const { subestacaoId } = req.params;
  const data = req.body;
  // console.log(subestacaoId);
  console.log(data);
  // const dadosParaAtualizar = {
  //   nome: data.nome,
  // };
  const subestacaoExist = await prisma.subestacao.findUnique({
    where: { id: Number(subestacaoId) },
    include: {
      componentes: { select: { id: true, tipo: true, nomeEquipamento: true } },
    },
  });

  for (const comp of data) {
    const componentesDoTipo = subestacaoExist.componentes.filter(
      (item) =>
        item.nomeEquipamento === comp.nomeEquipamento && item.tipo === comp.tipo
    );

    const quantidadeAtual = componentesDoTipo.length;
    const quantidadeDesejada = comp.quantidade;

    // Adiciona componentes se faltam
    if (quantidadeAtual < quantidadeDesejada) {
      const toCreate = Array.from(
        { length: quantidadeDesejada - quantidadeAtual },
        () => ({
          ...comp,
          subestacaoId: subestacaoExist.id,
        })
      );

      await prisma.componente.createMany({
        data: toCreate,
      });

      console.log(
        `Adicionados ${toCreate.length} componentes de ${comp.nomeEquipamento}`
      );
    }

    // Remove componentes extras
    if (quantidadeAtual > quantidadeDesejada) {
      const toDelete = componentesDoTipo
        .sort((a, b) => b.id - a.id)
        .slice(0, quantidadeAtual - quantidadeDesejada)
        .map((item) => item.id);

      await prisma.componente.deleteMany({
        where: { id: { in: toDelete } },
      });

      console.log(
        `Removidos ${toDelete.length} componentes de ${comp.nomeEquipamento}`
      );
    }
  }

  // Remove todos os componentes que não estão na entrada
  const tiposEntrada = data.map((c) => `${c.nomeEquipamento}|${c.tipo}`);

  const componentesParaRemover = subestacaoExist.componentes.filter(
    (item) => !tiposEntrada.includes(`${item.nomeEquipamento}|${item.tipo}`)
  );

  if (componentesParaRemover.length > 0) {
    await prisma.componente.deleteMany({
      where: {
        id: {
          in: componentesParaRemover.map((c) => c.id),
        },
      },
    });

    console.log(
      "Removidos fora da entrada:",
      componentesParaRemover.map((c) => c.id)
    );
  }

  if (!subestacaoExist) {
    return res
      .status(404)
      .json({ status: false, message: "Subestação não encontrada." });
  }

  // await prisma.subestacao.update({
  //   where: { id: Number(subestacaoId) },
  //   data: dadosParaAtualizar,
  // });

  return res.status(200).json({
    status: true,
    message: "Dados da subestação atualizados com sucesso.",
  });
};

export const detalharOrdemFuncionario = async (req, res) => {
  const { matricula, numeroOs } = req.validatedData;
  const nivelAcesso = req.funcionarioNivelAcesso;

  try {
    const ordem = await prisma.ordem.findUnique({
      where: { numeroOs },
      include: {
        tecnico: { select: { matricula: true, nome: true } },
        supervisor: { select: { matricula: true, nome: true } },
        subestacoes: {
          include: {
            componentes: {
              include: {
                ensaio: true,
              },
            },
          },
        },
      },
    });

    if (!ordem) {
      return res.status(404).json({
        status: false,
        message: "Ordem de serviço não localizada ou não existe.",
      });
    }

    if (
      nivelAcesso !== "ADMIN" &&
      ordem.supervisorMatricula !== matricula &&
      !ordem.tecnico.some((t) => t.matricula === matricula)
    ) {
      return res
        .status(403)
        .json({ status: false, message: "Acesso negado à ordem." });
    }

    return res.status(200).json({ status: true, data: ordem });
  } catch (error) {
    console.error("Erro ao detalhar ordem do funcionário:", error);

    return handleError(
      res,
      error,
      "Erro interno do servidor ao detalhar a ordem."
    );
  }
};

export const listarComponentesDaSubestacao = async (req, res) => {
  const { matricula, numeroOs, subestacaoId } = req.validatedData;
  const nivelAcesso = req.funcionarioNivelAcesso;

  const ordem = await prisma.ordem.findUnique({
    where: { numeroOs },
    include: {
      tecnico: { nome: true, matricula: true },
      supervisor: { nome: true, matricula: true },
      subestacoes: true,
    },
  });

  if (!ordem)
    return res.status(404).json({
      status: false,
      message: "Ordem não encontrada ou foi excluída.",
    });
  const subestacaoExiste = await prisma.subestacao.findFirst({
    where: { id: Number(subestacaoId) },
    include: { componentes: { include: { ensaio: true } } },
  });
  if (!subestacaoExiste)
    return res.status(403).json({
      status: false,
      message: "Subestação não existe ou não vinculada à OS.",
    });

  if (
    nivelAcesso !== "ADMIN" &&
    ordem.supervisorMatricula !== matricula &&
    !ordem.tecnico.some((t) => t.matricula === matricula)
  ) {
    return res
      .status(403)
      .json({ status: false, message: "Acesso negado à ordem." });
  }

  return res.status(200).json({
    status: true,
    data: subestacaoExiste.componentes,
  });
};

export const buscarFuncionarioPorMatricula = async (req, res) => {
  const { outraMatricula } = req.validatedData;
  const nivelAcesso = req.funcionarioNivelAcesso;

  const funcionario = await prisma.funcionario.findFirst({
    where: { matricula: String(outraMatricula) },
  });

  if (!funcionario) {
    return res.status(404).json({
      status: false,
      message: "Funcionário não encontrado ou não existe.",
    });
  }

  const { senha, ...rest } = funcionario;
  return res.status(200).json({
    status: true,
    data: nivelAcesso === "SUPERVISOR" ? rest : funcionario,
  });
};

export const adicionarComponente = async (req, res) => {
  const { params, body } = req.validatedData;
  const { subestacaoId } = params;
  const data = body;

  const componenteExiste = await prisma.componente.findFirst({
    where: {
      numeroSerie: data.numeroSerie,
      subestacaoId: Number(subestacaoId),
    },
  });

  if (componenteExiste && data.numeroSerie !== "N/A") {
    return res.status(409).json({
      status: false,
      message: `Componente com o número de série '${data.numeroSerie}' já existe nesta subestação.`,
    });
  }

  const componenteCriado = await prisma.componente.create({
    data: {
      ...data,
      subestacao: { connect: { id: Number(subestacaoId) } },
    },
  });

  return res.status(201).json({
    status: true,
    message: "Componente cadastrado com sucesso.",
    data: componenteCriado,
  });
};

export const atualizarComponente = async (req, res) => {
  const {
    params: { numeroOs, subestacaoId, componenteId },
    body: data,
  } = req.validatedData;
  const { funcionarioMatricula, funcionarioNivelAcesso } = req;
  console.log("Entrou no atualizarComponente");
  const osVinculada = await prisma.ordem.findFirst({
    where: { numeroOs },
    include: {
      tecnico: { select: { matricula: true, nome: true } },
    },
  });

  if (
    !osVinculada.tecnico.some((t) => t.matricula === funcionarioMatricula) &&
    funcionarioNivelAcesso === "TECNICO"
  )
    return res.status(401).json({
      status: false,
      message: "Acesso negado, técnico não vinculado à OS ou não autorizado.",
    });
  console.log("Saiu do validador1");
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
  const {
    params: { matricula, subestacaoId, componenteId },
  } = req.validatedData;

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
      feitoPor: matricula,
    },
  });
  return res
    .status(200)
    .json({ status: true, message: "Componente foi excluído com sucesso." });
};

export const adicionarEnsaioComponente = async (req, res) => {
  const {
    params: { matricula, componenteId },
    body: { tipo, dados, engenheiro, equipamentosUtilizados, foto },
  } = req.validatedData;

  try {
    await prisma.$transaction(async (tx) => {
      const dadosParaSalvar = {
        dados,
        equipamentosUtilizados: equipamentosUtilizados || [],
        tipo: tipo,
        responsavel: { connect: { matricula: matricula } },
        engenheiroResponsavel: engenheiro || null,
        fotos: {
          create: (foto || []).map((urlDaFoto) => ({
            url: urlDaFoto.src,
            descricao: urlDaFoto.description || null,
          })),
        },
      };

      const ensaioExistente = await tx.ensaio.findFirst({
        where: {
          tipo: tipo,
          componenteId: Number(componenteId),
        },
      });

      if (ensaioExistente) {
        await tx.foto.deleteMany({
          where: { ensaioId: ensaioExistente.id },
        });

        await tx.ensaio.update({
          where: { id: ensaioExistente.id },
          data: dadosParaSalvar,
        });
      } else {
        await tx.ensaio.create({
          data: {
            ...dadosParaSalvar,
            componente: { connect: { id: Number(componenteId) } },
          },
        });
      }
    });

    return res
      .status(200)
      .json({ status: true, message: "Ensaio salvo com sucesso." });
  } catch (error) {
    console.error("### ERRO DETALHADO AO SALVAR ENSAIO ###", error);

    throw error;
  }
};

export const listarEnsaioComponente = async (req, res) => {};

// Não fiz ainda
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
      feitoPor: matricula,
    },
  });

  return res.status(200).json({
    status: true,
    message: "Ensaio foi excluído do componente com sucesso.",
  });
};

export const listarLogs = async (req, res) => {
  const logs = await prisma.logAtividade.findMany({
    orderBy: { criadoEm: "desc" },
  });

  return res.status(200).json({ status: true, data: logs });
};

export const cadastrarEquipamento = async (req, res) => {
  const { body: data } = req.validatedData;

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
  const {
    body: data,
    params: { equipamentoId },
  } = req.validatedData;

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
  const {
    params: { matricula, equipamentoId },
  } = req.validatedData;

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
      feitoPor: matricula,
    },
  });

  return res.status(200).json({
    statue: true,
    message: "Equipamento excluído com sucesso.",
  });
};

export const atualizarComponentesDaSubestacao = async (req, res) => {
  const { subestacaoId } = req.params;
  const componentesDoForm = req.body.componentes;

  if (!componentesDoForm || !Array.isArray(componentesDoForm)) {
    return res
      .status(400)
      .json({ status: false, message: "A lista de componentes é inválida." });
  }

  try {
    await prisma.$transaction(async (tx) => {
      // 1. Pega os componentes que já existem no banco para esta subestação.
      const componentesAtuais = await tx.componente.findMany({
        where: { subestacaoId: Number(subestacaoId) },
        include: { _count: { select: { ensaio: true } } }, // Conta quantos ensaios cada um tem
      });

      // 2. Itera sobre cada tipo de equipamento enviado pelo formulário.
      for (const compInfo of componentesDoForm) {
        const nomeEquipamento = compInfo.nomeEquipamento;
        const tipoEquipamento = compInfo.tipo;
        const qtdDesejada = compInfo.quantidade;

        const compsAtuaisDoTipo = componentesAtuais.filter(
          (c) => c.nomeEquipamento === nomeEquipamento
        );
        const qtdAtual = compsAtuaisDoTipo.length;

        if (qtdDesejada > qtdAtual) {
          // PRECISA ADICIONAR: Cria a quantidade que falta.
          const aAdicionar = qtdDesejada - qtdAtual;
          for (let i = 0; i < aAdicionar; i++) {
            await tx.componente.create({
              data: {
                nomeEquipamento: nomeEquipamento,
                tipo: tipoEquipamento,
                subestacaoId: Number(subestacaoId),
                numeroSerie: "N/A",
                fabricante: "N/A",
              },
            });
          }
        } else if (qtdDesejada < qtdAtual) {
          // PRECISA REMOVER: Deleta os excedentes, priorizando os que não têm medições.
          const aDeletar = qtdAtual - qtdDesejada;

          const idsParaDeletar = compsAtuaisDoTipo
            .sort((a, b) => a._count.ensaio - b._count.ensaio) // Ordena para que os "vazios" venham primeiro
            .slice(0, aDeletar) // Pega a quantidade exata para deletar
            .map((c) => c.id);

          if (idsParaDeletar.length > 0) {
            await tx.componente.deleteMany({
              where: { id: { in: idsParaDeletar } },
            });
          }
        }
      }

      // 3. Remove os tipos de equipamento que não vieram no formulário (quantidade = 0)
      const nomesNoForm = componentesDoForm.map((c) => c.nomeEquipamento);
      const componentesParaRemoverTotalmente = componentesAtuais
        .filter((c) => !nomesNoForm.includes(c.nomeEquipamento))
        .map((c) => c.id);

      if (componentesParaRemoverTotalmente.length > 0) {
        await tx.componente.deleteMany({
          where: { id: { in: componentesParaRemoverTotalmente } },
        });
      }
    });

    return res.status(200).json({
      status: true,
      message: "Equipamentos da subestação sincronizados com sucesso.",
    });
  } catch (error) {
    console.error("Erro ao sincronizar componentes da subestação:", error);
    return res.status(500).json({
      status: false,
      message: "Erro interno ao sincronizar equipamentos.",
    });
  }
};
