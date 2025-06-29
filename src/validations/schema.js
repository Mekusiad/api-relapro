import { optional, z } from "zod";

export const loginSchema = z.object({
  usuario: z.string().min(1, "Nome de usuário é obrigatório."),
  senha: z.string().min(5, "Senha é obrigatória."),
});

export const homeInfoSchema = z
  .object({
    funcionarioMatricula: z.preprocess(
      (val) => String(val).trim(),
      z.string().regex(/^\d+$/, "A matrícula deve conter apenas números")
    ),
  })
  .strict();

export const registrarFuncionarioSchema = z
  .object({
    nome: z
      .string()
      .min(3, "Nome é obrigatório e deve ter pelo menos 3 caracteres"),
    // usuario: z.string().min(3, "Usuário é obrigatório"),
    matricula: z
      .string()
      .min(1, "Obrigatório informar matrícula.")
      .max(5000, "Toma."),
    cargo: z.string().min(2, "Cargo é obrigatório"),
    // admissao: z.string().refine((val) => !isNaN(Date.parse(val)), {
    //   message: "Data de admissão inválida",
    // }),
    senha: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
    nivelAcesso: z.enum(["ADMIN", "SUPERVISOR", "TECNICO"]).optional(),
  })
  .strict();

export const atualizarDadosFuncionarioSchema = z
  .object({
    nome: z.string().min(3).optional(),
    usuario: z.string().min(3).optional(),
    matricula: z.string().max(1000, "Máximo de 1000 caracteres.").optional(),
    cargo: z.string().min(2).optional(),
    admissao: z
      .string()
      .refine((val) => !isNaN(Date.parse(val)), { message: "Data inválida" })
      .optional(),
    senha: z.string().min(6).optional(),
    nivelAcesso: z.enum(["ADMIN", "SUPERVISOR", "TECNICO"]).optional(),
  })
  .strict();

export const excluirFuncionarioSchema = z
  .object({
    matricula: z.preprocess(
      (val) => String(val).trim(),
      z.string().regex(/^\d+$/, "A matrícula deve conter apenas números")
    ),
    outraMatricula: z.preprocess(
      (val) => String(val).trim(),
      z.string().regex(/^\d+$/, "A matrícula deve conter apenas números")
    ),
  })
  .strict();

export const listarFuncionariosSchema = z
  .object({
    matricula: z
      .string()
      .regex(/^\d+$/, "A matrícula deve conter apenas números"),
  })
  .strict();

export const listarOrdensDoFuncionarioSchema = {
  params: z
    .object({
      matricula: z
        .string()
        .regex(/^\d+$/, "A matrícula deve conter apenas números.")
        .transform(Number),
    })
    .strict(),

  query: z
    .object({
      status: z
        .string()
        .optional()
        .refine(
          (val) =>
            !val || ["ABERTA", "EM_ANDAMENTO", "FINALIZADA"].includes(val),
          {
            message:
              "Status inválido. Use: ABERTA, EM_ANDAMENTO ou FINALIZADA.",
          }
        ),
      numeroOs: z.string().optional(),
      cliente: z.string().optional(),
      page: z
        .string()
        .optional()
        .transform((val) => (val ? parseInt(val, 10) : 1))
        .refine((val) => Number.isInteger(val) && val > 0, {
          message: "A página deve ser um número inteiro positivo.",
        }),
    })
    .strict(),
};

export const criarOrdemSchema = z
  .object({
    cliente: z.string().min(1),
    nomeResponsavel: z.string().min(1),
    numeroOrcamento: z
      .string()
      .min(1, "Número do orçamento deve ter no mínimo 1 caractere.")
      .max(20, "Número do orçamento deve ter no máximo 20 caracteres.")
      .optional(),
    contato: z.string().min(1, "Número de contato é obrigatório preencher."),
    email: z.string().email("Email é obrigatório"),
    tipoServico: z.enum(
      [
        "MANUTENCAO_PREVENTIVA",
        "MANUTENCAO_CORRETIVA",
        "MANUTENCAO_PREDITIVA",
        "ENSAIO_EPI",
        "INSPECAO",
        "INSTALACAO",
        "OUTROS",
      ],
      {
        required_error: "É obrigatório informar o tipo de serviço.",
        invalid_type_error: "Tipo de serviço inválido.",
      }
    ),
    localServico: z.string().min(1, "Obrigatório informar o local do serviço."),
    descricaoInicial: z
      .string()
      .min(1, "Obrigatório informar a descrição inicial do serviço."),
    previsaoInicio: z.string().refine((val) => !isNaN(Date.parse(val)), {
      message: "Data inválida",
    }),

    status: z
      .string()
      .optional()
      .refine(
        (val) => !val || ["ABERTA", "EM_ANDAMENTO", "FINALIZADA"].includes(val),
        {
          message: "Status inválido.",
        }
      ),
    observacoes: z.string().max(150, "Máximo de 150 caracteres").optional(),
    subestacoes: z.array(z.any()),
    supervisor: z.string().max(100, "Máximo de 100 caracteres.").optional(),
    tecnico: z.string().max(100, "Máximo de 100 caracteres.").optional(),
  })
  .strict();

// Teste ---

export const criarOrdemComSubestacoesSchema = z
  .object({
    cliente: z.string().min(1, "Cliente é obrigatório"),
    nomeResponsavel: z.string().min(1, "Nome do responsável é obrigatório"),
    numeroOrcamento: z
      .string()
      .min(1, "Número do orçamento deve ter no mínimo 1 caractere.")
      .max(20, "Número do orçamento deve ter no máximo 20 caracteres.")
      .optional(),
    contato: z.string().min(1, "Número de contato é obrigatório preencher."),
    email: z.string().email("Email é obrigatório"),
    tipoServico: z.enum(
      [
        "MANUTENCAO_PREVENTIVA",
        "MANUTENCAO_CORRETIVA",
        "MANUTENCAO_PREDITIVA",
        "ENSAIO_EPI",
        "INSPECAO",
        "INSTALACAO",
        "OUTROS",
      ],
      {
        required_error: "É obrigatório informar o tipo de serviço.",
        invalid_type_error: "Tipo de serviço inválido.",
      }
    ),
    localServico: z.string().min(1, "Obrigatório informar o local do serviço."),
    descricaoInicial: z
      .string()
      .min(1, "Obrigatório informar a descrição inicial do serviço."),
    previsaoInicio: z.string().refine((val) => !isNaN(Date.parse(val)), {
      message: "Data inválida",
    }),
    status: z
      .string()
      .optional()
      .refine(
        (val) => !val || ["ABERTA", "EM_ANDAMENTO", "FINALIZADA"].includes(val),
        {
          message: "Status inválido.",
        }
      ),
    observacoes: z.string().max(150, "Máximo de 150 caracteres").optional(),

    subestacoes: z
      .array(
        z.object({
          nome: z.string().min(1, "Nome da subestação é obrigatório"),
          componentes: z
            .array(
              z.object({
                nomeEquipamento: z
                  .string()
                  .max(100, "Máximo de 100 caracteres.")
                  .min(1, "Nome do equipamento é obrigatório"),
                tipo: z.enum([
                  "TRAFO_ALTA",
                  "TRAFO_MEDIA",
                  "TRAFO_CORRENTE",
                  "TRAFO_POTENCIA",
                  "TRAFO_FORCA",
                  "DISJUNTOR_ALTA",
                  "DISJUNTOR_MEDIA",
                  "DISJUNTOR_BAIXA",
                  "RESISTOR",
                  "CHAVE_SECCIONADORA",
                  "MALHA",
                  "BUCHA",
                  "CABOMUFLA",
                ]),
                numeroSerie: z.string().optional().nullable(),
                quantidade: z.number().int().positive().optional(),
              })
            )
            .optional(),
        })
      )
      .min(1, "Deve conter ao menos uma subestação"),

    supervisor: z.string().max(100, "Máximo de 100 caracteres.").optional(),
    tecnico: z
      .array(z.string().max(100, "Máximo de 100 caracteres."))
      .optional(),
  })
  .strict();

export const atualizarOrdemSchema = z.object({
  params: z
    .object({
      matricula: z.string().max(500, "Máximo de 500 caracteres."),
      numeroOs: z.string().max(500, "Máximo de 500 caracteres."),
    })
    .strict(),
  body: z
    .object({
      cliente: z.string().max(100, "Máximo de 100 caracteres.").optional(),
      nomeResponsavel: z
        .string()
        .max(100, "Máximo de 100 caracteres.")
        .optional(),
      localServico: z.string().max(100, "Máximo de 100 caracteres.").optional(),
      email: z.string().email("E-mail inválido").optional(),
      contato: z.string().max(100, "Máximo de 100 caracteres.").optional(),
      numeroOrcamento: z
        .string()
        .max(100, "Máximo de 100 caracteres.")
        .optional(),
      tipoServico: z
        .enum([
          "MANUTENCAO_PREVENTIVA",
          "MANUTENCAO_CORRETIVA",
          "MANUTENCAO_PREDITIVA",
          "ENSAIO_EPI",
          "INSPECAO",
          "INSTALACAO",
          "OUTROS",
        ])
        .optional(),
      previsaoInicio: z
        .string()
        .datetime({ message: "Data de início inválida" })
        .optional(),
      status: z.enum(["ABERTA", "EM_ANDAMENTO", "CONCLUIDA"]).optional(),
      descricaoInicial: z
        .string()
        .max(100, "Descrição é obrigatória")
        .optional(),
      tecnico: z
        .array(z.string().max(100, "Matrícula obrigatória"))
        .nonempty("Ao menos um técnico é necessário")
        .optional(),
      supervisor: z
        .string()
        .max(100, "Matrícula do supervisor obrigatória")
        .optional(),
      observacoes: z.string().optional(),
      subestacoes: z
        .array(
          z.object({
            id: z.union([z.number(), z.string()]), // Pode vir como número ou string temporária
            nome: z.string().max(100, "Nome da subestação é obrigatório"),
            observacoesTecnicasSubestacao: z.string().optional(),
            componentes: z.array(
              z.object({
                nomeEquipamento: z
                  .string()
                  .max(100, "Nome do equipamento obrigatório"),
                tipo: z.string().max(100, "Tipo de equipamento obrigatório"),
                quantidade: z
                  .number()
                  .int()
                  .max(100, "Quantidade deve ser maior que 0"),
                numeroSerie: z.string(),
                fabricante: z.string(),
              })
            ),
          })
        )
        .nonempty("Deve haver ao menos uma subestação")
        .optional(),
    })
    .strict(),
  query: z.any().optional(),
});

export const excluirOsSchema = z
  .object({
    matricula: z.string().regex(/^\d+$/).transform(Number),
    numeroOs: z.string().min(1),
  })
  .strict();

export const adicionarTecnicoSchema = z
  .object({
    numeroOs: z.string().min(1),
    tecnicoMatricula: z.array(
      z.preprocess(
        (val) => String(val).trim(),
        z.string().regex(/^\d+$/, "Matrícula inválida")
      )
    ),
  })
  .strict();

export const removerTecnicoSchema = z
  .object({
    numeroOs: z.string().min(1),
    tecnicoMatricula: z.array(
      z.preprocess(
        (val) => String(val).trim(),
        z.string().regex(/^\d+$/, "Matrícula inválida")
      )
    ),
  })
  .strict();

export const trocarSupervisorSchema = z
  .object({
    numeroOs: z.string().min(1, "Número da OS é obrigatório."),
    supervisorMatricula: z.coerce.number({
      required_error: "A matrícula do supervisor é obrigatória.",
      invalid_type_error: "A matrícula deve ser um número.",
    }),
  })
  .strict();

export const atualizaStatusSchema = z
  .object({
    numeroOs: z.string().min(1, "Número da OS é obrigatório."),
    status: z.enum(["ABERTA", "EM_ANDAMENTO", "FINALIZADA", "CANCELADA"], {
      required_error: "Status é obrigatório.",
      invalid_type_error: "Status inválido.",
    }),
  })
  .strict();

export const adicionarSubestacaoSchema = z.object({
  params: z.object({
    matricula: z.string().regex(/^\d+$/),
    numeroOs: z.string().min(1),
  }),
  body: z.object({
    nome: z.string().min(1, "O nome da subestação é obrigatório."),
    componentes: z.array(z.any()),
  }),
});

export const listarSubestacaoSchema = z
  .object({
    matricula: z
      .string()
      .regex(/^\d+$/, "A matrícula deve conter apenas números.")
      .transform(Number),
    numeroOs: z.string().min(1, "Número da OS é obrigatório."),
  })
  .strict();

export const removerSubestacaoSchema = z
  .object({
    matricula: z
      .string()
      .regex(/^\d+$/, "A matrícula deve conter apenas números.")
      .transform(Number),
    numeroOs: z.string().min(1, "Número da OS é obrigatório."),
    subestacaoId: z
      .string()
      .regex(/^\d+$/, "Id da subestação deve conter apenas números.")
      .transform(Number),
  })
  .strict();

export const atualizarDadosSubestacaoSchema = z
  .object({
    matricula: z
      .string()
      .regex(/^\d+$/, "A matrícula deve conter apenas números.")
      .transform(Number),
    numeroOs: z.string().min(1, "Número da OS é obrigatório."),
    subestacaoId: z
      .string()
      .regex(/^\d+$/, "Id da subestação deve conter apenas números.")
      .transform(Number),
  })
  .strict();

export const detalharOrdemFuncionarioSchema = z
  .object({
    matricula: z
      .string()
      .regex(/^\d+$/, "A matrícula deve conter apenas números.")
      .transform(Number),
    numeroOs: z.string().min(1, "Número da OS é obrigatório."),
  })
  .strict();

export const listarComponentesDaSubestacaoSchema = z
  .object({
    matricula: z
      .string()
      .regex(/^\d+$/, "A matrícula deve conter apenas números.")
      .transform(Number),
    numeroOs: z.string().min(1, "Número da OS é obrigatório."),
    subestacaoId: z
      .string()
      .regex(/^\d+$/, "Id da subestação deve conter apenas números.")
      .transform(Number),
  })
  .strict();
// A partir daqui foi usado o validateGererico - Usar depois nas rotas anteriores.
export const adicionarComponenteSchema = z.object({
  params: z
    .object({
      matricula: z.coerce.number(),
      numeroOs: z.string(),
      subestacaoId: z.coerce.number(),
    })
    .strict(),
  body: z
    .object({
      nomeEquipamento: z.string().min(1, "Nome é obrigatório"),
      numeroSerie: z.string().min(1, "Número de série é obrigatório"),
      tipo: z.string().min(1, "Tipo é obrigatório"),
      fabricante: z.string().min(1, "Tipo é obrigatório"),
      quantidade: z.number().int().positive().optional(),
    })
    .strict(),
  query: z.object({}).optional(),
});

export const atualizarComponenteSchema = z.object({
  params: z
    .object({
      matricula: z.string().max(100, "Máximo de 100 caracteres."),
      numeroOs: z.string().max(100, "Máximo de 100 caracteres."),
      subestacaoId: z.coerce.number(),
      componenteId: z.coerce.number(),
    })
    .strict(),
  body: z
    .object({
      nomeEquipamento: z.string().optional(),
      quantidade: z.number().int().positive().optional(),
      cliente: z.string().optional(),
      tag: z.string().optional(),
      identificacao: z.string().optional(),
      localizacao: z.string().optional(),
      tipo: z
        .enum([
          "TRAFO_ALTA",
          "TRAFO_MEDIA",
          "TRAFO_CORRENTE",
          "TRAFO_POTENCIA",
          "TRAFO_FORCA",
          "DISJUNTOR_ALTA",
          "DISJUNTOR_MEDIA",
          "DISJUNTOR_BAIXA",
          "RESISTOR",
          "CHAVE_SECCIONADORA",
          "MALHA",
          "BUCHA",
          "CABOMUFLA",
        ])
        .optional(),
      modelo: z.string().optional(),
      fabricante: z.string().optional(),
      numeroSerie: z.string().optional(),
      meioIsolante: z.string().optional(),
      anoFabricacao: z.coerce.number().int().optional(),
      massaTotal: z.coerce.number().optional(),
      potencia: z.string().optional(),
      correnteNominal: z.coerce.number().optional(),
      tensaoNominal: z.coerce.number().optional(),
      tipoTensaoAt: z
        .enum(["X", "Y", "NA"], {
          required_error: "Tipo de tensão é TRIANGULO OU ESTRELA OU NA",
          invalid_type_error: "Tipo de tensao inválido.",
        })
        .optional(),
      tensaoAt: z.coerce.number().optional(),
      tipoTensaoBt: z
        .enum(["X", "Y", "NA"], {
          required_error: "Tipo de tensão é TRIANGULO OU ESTRELA OU NA",
          invalid_type_error: "Tipo de tensao inválido.",
        })
        .optional(),
      tensaoBt: z.string().max(100, "Máximo de 100 caractere").optional(),
      correntePrimario: z.coerce
        .number()
        .max(70000, "Máximo 70000 dígitos.")
        .optional(),
      correnteSecundario: z.coerce
        .number()
        .max(70000, "Máximo 70000 dígitos.")
        .optional(),
      volumeOleoIsolante: z.coerce.number().optional(),
      temperaturaEnsaio: z.coerce.number().optional(),
      umidadeRelativaAr: z.coerce.number().optional(),
      impedancia: z.coerce.number().optional(),
      exatidao: z.coerce.number().optional(),
      frequencia: z.coerce.number().optional(),
      circuito: z.coerce.number().optional(),
      tipoPressao: z.string().optional(),
      pressao: z.coerce.number().optional(),
      bitolaCabo: z.coerce.number().optional(),
      ensaio: z.any(),
    })
    .strict(),
  query: z.object({}).optional(),
});

export const excluirComponenteSchema = z.object({
  params: z
    .object({
      matricula: z.coerce.number(),
      numeroOs: z.string(),
      subestacaoId: z.coerce.number(),
      componenteId: z.coerce.number(),
    })
    .strict(),
});

export const buscarFuncionarioPorMatriculaSchema = z.object({
  matricula: z
    .string()
    .regex(/^\d+$/, "A matrícula deve conter apenas números.")
    .transform(Number),
  outraMatricula: z
    .string()
    .regex(/^\d+$/, "A matrícula deve conter apenas números.")
    .transform(Number),
});

export const cadastrarEquipamentoSchema = z.object({
  body: z
    .object({
      nome: z.string().min(1, "Nome do equipamento é obrigatório."),
      descricao: z.string().min(1, "Descrição do equipamento é obrigatório."),
      modelo: z.string().min(1, "Modelo é obrigatório"),
      numeroSerie: z.string().min(1, "O número de série é obrigatório."),
      foto: z.string().url("URL inválida").optional(),
    })
    .strict(),
});

export const atualizarEquipamentoSchema = z.object({
  body: z
    .object({
      nome: z.string().optional(),
      descricao: z.string().optional(),
      modelo: z.string().optional(),
      numeroSerie: z.string().optional(),
      foto: z.string().url("URL inválida").optional(),
    })
    .strict(),
  params: z
    .object({
      matricula: z
        .string()
        .regex(/^\d+$/, "A matrícula deve conter apenas números.")
        .transform(Number),
      equipamentoId: z
        .string()
        .regex(/^\d+$/, "Id do equipamento deve conter apenas números.")
        .transform(Number),
    })
    .strict(),
});

export const removerEquipamentoSchema = z.object({
  params: z
    .object({
      matricula: z
        .string()
        .regex(/^\d+$/, "A matrícula deve conter apenas números.")
        .transform(Number),
      equipamentoId: z
        .string()
        .regex(/^\d+$/, "Id do equipamento deve conter apenas números.")
        .transform(Number),
    })
    .strict(),
});

export const listarEquipamentosSchema = z.object({
  params: z
    .object({
      matricula: z
        .string()
        .regex(/^\d+$/, "A matrícula deve conter apenas números.")
        .transform(Number),
    })
    .strict(),
});

// Schemas por tipo de ensaio
export const ensaioSchema = z
  .object({
    body: z
      .object({
        tipo: z.enum([
          "TRAFO_ALTA",
          "TRAFO_POTENCIA",
          "TRAFO_CORRENTE",
          "DISJUNTOR_ALTA",
          "DISJUNTOR_MEDIA",
          "RESISTOR",
          "CHAVE_SECCIONADORA",
          "MALHA",
          "CABOMUFLA",
          "OUTRO",
          "BUCHA",
        ]),
        responsavel: z
          .string()
          .max(1000, "Máximo de 1000 caracteres.")
          .optional(),

        // LINHAS ADICIONADAS:
        // dataEnsaio: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "Data do ensaio inválida" }).optional(),
        engenheiro: z
          .string()
          .max(1000, "Máximo de 1000 caracteres.")
          .optional(),
        equipamentosUtilizados: z
          .array(
            z.object({
              nome: z.string(),
              modelo: z.string().nullable(),
              serie: z.string().nullable(),
            })
          )
          .optional(),

        foto: z.array(z.string().url("URL da foto inválida")).optional(),
        dados: z.any(),
      })
      .strict(),
    params: z.object({
      matricula: z.string().regex(/^\d+$/),
      numeroOs: z
        .string()
        .min(1, "OS deve possuir no mínimo 1 dígito.")
        .max(8, "OS deve possuir no máximo 8 dígitos."),
      subestacaoId: z.coerce
        .number()
        .min(1, "OS deve possuir no mínimo 1 dígito.")
        .max(1000, "OS deve possuir no máximo 1000 dígitos."),
      componenteId: z.coerce
        .number()
        .min(1, "OS deve possuir no mínimo 1 dígito.")
        .max(1000, "ID componente deve possuir no máximo 1000 dígitos."),
    }),
    query: z.object({}).optional(), // se houver filtros, coloque aqui
  })
  .strict();
// Schemas por tipo de ensaio
const trafoPotenciaSchema = z.object({
  tapComutadorAt: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z.enum(["1", "2", "3", "4", "5", "-"]).default("-").optional()
  ),
  tapComutadorBt: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z.enum(["1", "2", "3", "4", "5", "-"]).default("-").optional()
  ),
  relacaoCalculadaAtxBt: z.coerce.number().max(100).nullable().optional(),
  relacaoMedida1: z.coerce.number().max(100).nullable().optional(),
  relacaoMedida2: z.coerce.number().max(100).nullable().optional(),
  relacaoMedida3: z.coerce.number().max(100).nullable().optional(),
  resistenciaOhmicaEnrolamentoAt1: z.coerce
    .number()
    .max(100)
    .nullable()
    .optional(),
  resistenciaOhmicaEnrolamentoAt2: z.coerce
    .number()
    .max(100)
    .nullable()
    .optional(),
  resistenciaOhmicaEnrolamentoAt3: z.coerce
    .number()
    .max(100)
    .nullable()
    .optional(),
  resistenciaOhmicaEnrolamentoBt1: z.coerce
    .number()
    .max(100)
    .nullable()
    .optional(),
  resistenciaOhmicaEnrolamentoBt2: z.coerce
    .number()
    .max(100)
    .nullable()
    .optional(),
  resistenciaOhmicaEnrolamentoBt3: z.coerce
    .number()
    .max(100)
    .nullable()
    .optional(),
  tensaoEnsaio: z.coerce.number().max(5000).nullable().optional(),
  tempoEnsaio: z.coerce.number().max(60).nullable().optional(),
  resistenciaIsolamentoAtxBt: z.coerce.number().max(5000).nullable().optional(),
  resistenciaIsolamentoAtxMassa: z.coerce
    .number()
    .max(5000)
    .nullable()
    .optional(),
  resistenciaIsolamentoBtxMassa: z.coerce
    .number()
    .max(5000)
    .nullable()
    .optional(),
  servico1: z.enum(["SIM", "NAO", "N/A"]).optional(),
  servico2: z.enum(["SIM", "NAO", "N/A"]).optional(),
  servico3: z.enum(["SIM", "NAO", "N/A"]).optional(),
  servico4: z.enum(["SIM", "NAO", "N/A"]).optional(),
  servico5: z.enum(["SIM", "NAO", "N/A"]).optional(),
  servico6: z.enum(["SIM", "NAO", "N/A"]).optional(),
  servico7: z.enum(["SIM", "NAO", "N/A"]).optional(),
  servico8: z.enum(["SIM", "NAO", "N/A"]).optional(),
  servico9: z.enum(["SIM", "NAO", "N/A"]).optional(),
  servico10: z.enum(["SIM", "NAO", "N/A"]).optional(),
  servico11: z.enum(["SIM", "NAO", "N/A"]).optional(),
  servico12: z.enum(["SIM", "NAO", "N/A"]).optional(),
  servico13: z.enum(["SIM", "NAO", "N/A"]).optional(),
  correnteN1: z.number().max(100).nullable().optional(),
  correnteN2: z.number().max(100).nullable().optional(),
  correnteN3: z.number().max(100).nullable().optional(),
  correnteN4: z.number().max(100).nullable().optional(),
  correnteN5: z.number().max(100).nullable().optional(),
  correnteN6: z.number().max(100).nullable().optional(),
  wattsN1: z.number().max(100).nullable().optional(),
  wattsN2: z.number().max(100).nullable().optional(),
  wattsN3: z.number().max(100).nullable().optional(),
  wattsN4: z.number().max(100).nullable().optional(),
  wattsN5: z.number().max(100).nullable().optional(),
  wattsN6: z.number().max(100).nullable().optional(),
  fatorPotenciaN1: z.number().max(100).nullable().optional(),
  fatorPotenciaN2: z.number().max(100).nullable().optional(),
  fatorPotenciaN3: z.number().max(100).nullable().optional(),
  fatorPotenciaN4: z.number().max(100).nullable().optional(),
  fatorPotenciaN5: z.number().max(100).nullable().optional(),
  fatorPotenciaN6: z.number().max(100).nullable().optional(),
  capacitanciaN1: z.number().max(100).nullable().optional(),
  capacitanciaN2: z.number().max(100).nullable().optional(),
  capacitanciaN3: z.number().max(100).nullable().optional(),
  capacitanciaN4: z.number().max(100).nullable().optional(),
  capacitanciaN5: z.number().max(100).nullable().optional(),
  capacitanciaN6: z.number().max(100).nullable().optional(),
  numeroSerieBucha1: z.string().max(100).nullable().optional(),
  numeroSerieBucha2: z.string().max(100).nullable().optional(),
  numeroSerieBucha3: z.string().max(100).nullable().optional(),
  correnteBucha1: z.number().max(100).nullable().optional(),
  correnteBucha2: z.number().max(100).nullable().optional(),
  correnteBucha3: z.number().max(100).nullable().optional(),
  wattsBucha1: z.number().max(100).nullable().optional(),
  wattsBucha2: z.number().max(100).nullable().optional(),
  wattsBucha3: z.number().max(100).nullable().optional(),
  fatorPotenciaCorrente: z.number().max(100).nullable().optional(),
  fatorPotenciaBucha1: z.number().max(100).nullable().optional(),
  fatorPotenciaBucha2: z.number().max(100).nullable().optional(),
  fatorPotenciaBucha3: z.number().max(100).nullable().optional(),
  capacitanciaBucha1: z.number().max(100).nullable().optional(),
  capacitanciaBucha2: z.number().max(100).nullable().optional(),
  capacitanciaBucha3: z.number().max(100).nullable().optional(),
  correnteH1H3: z.number().max(5).nullable().optional(),
  correnteH2H1: z.number().max(5).nullable().optional(),
  correnteH3H2: z.number().max(5).nullable().optional(),
  avaliacao: z.enum(["CONFORME", "NAO_CONFORME"]).optional(),
  descricaoAvaliacao: z.string().max(500).optional(),
  observacao: z.string().max(100).optional(),
  protecao1: z.enum(["CONFORME", "NAO_CONFORME", "N/A"]).optional(),
  protecao2: z.enum(["CONFORME", "NAO_CONFORME", "N/A"]).optional(),
  protecao3: z.enum(["CONFORME", "NAO_CONFORME", "N/A"]).optional(),
  protecao4: z.enum(["CONFORME", "NAO_CONFORME", "N/A"]).optional(),
  protecao5: z.enum(["CONFORME", "NAO_CONFORME", "N/A"]).optional(),
  protecao6: z.enum(["CONFORME", "NAO_CONFORME", "N/A"]).optional(),
});
const trafoAltaSchema = z
  .object({
    servico1: z
      .enum(["SIM", "NAO", "N/A"], {
        required_error: "É obrigatório informar se o serviço 1 foi realizado.",
        invalid_type_error: "Serviço 1 inválido.",
      })
      .optional(),
    servico2: z
      .enum(["SIM", "NAO", "N/A"], {
        required_error: "É obrigatório informar se o serviço 2 foi realizado.",
        invalid_type_error: "Serviço 2 inválido.",
      })
      .optional(),
    servico3: z
      .enum(["SIM", "NAO", "N/A"], {
        required_error: "É obrigatório informar se o serviço 3 foi realizado.",
        invalid_type_error: "Serviço 3 inválido.",
      })
      .optional(),
    servico4: z
      .enum(["SIM", "NAO", "N/A"], {
        required_error: "É obrigatório informar se o serviço 4 foi realizado.",
        invalid_type_error: "Serviço 4 inválido.",
      })
      .optional(),
    servico5: z
      .enum(["SIM", "NAO", "N/A"], {
        required_error: "É obrigatório informar se o serviço 5 foi realizado.",
        invalid_type_error: "Serviço 5 inválido.",
      })
      .optional(),
    servico6: z
      .enum(["SIM", "NAO", "N/A"], {
        required_error: "É obrigatório informar se o serviço 6 foi realizado.",
        invalid_type_error: "Serviço 6 inválido.",
      })
      .optional(),
    servico7: z
      .enum(["SIM", "NAO", "N/A"], {
        required_error: "É obrigatório informar se o serviço 7 foi realizado.",
        invalid_type_error: "Serviço 7 inválido.",
      })
      .optional(),
    servico8: z
      .enum(["SIM", "NAO", "N/A"], {
        required_error: "É obrigatório informar se o serviço 8 foi realizado.",
        invalid_type_error: "Serviço 8 inválido.",
      })
      .optional(),
    servico9: z
      .enum(["SIM", "NAO", "N/A"], {
        required_error: "É obrigatório informar se o serviço 9 foi realizado.",
        invalid_type_error: "Serviço 9 inválido.",
      })
      .optional(),
    servico10: z
      .enum(["SIM", "NAO", "N/A"], {
        required_error: "É obrigatório informar se o serviço 10 foi realizado.",
        invalid_type_error: "Serviço 10 inválido.",
      })
      .optional(),
    servico11: z
      .enum(["SIM", "NAO", "N/A"], {
        required_error: "É obrigatório informar se o serviço 11 foi realizado.",
        invalid_type_error: "Serviço 11 inválido.",
      })
      .optional(),
    servico12: z
      .enum(["SIM", "NAO", "N/A"], {
        required_error: "É obrigatório informar se o serviço 12 foi realizado.",
        invalid_type_error: "Serviço 12 inválido.",
      })
      .optional(),
    servico13: z
      .enum(["SIM", "NAO", "N/A"], {
        required_error: "É obrigatório informar se o serviço 13 foi realizado.",
        invalid_type_error: "Serviço 13 inválido.",
      })
      .optional(),

    tapComutadorAt: z
      .enum(["1", "2", "3", "4", "5", "-"])
      .default("-")
      .optional(),
    tapComutadorBt: z
      .enum(["1", "2", "3", "4", "5", "-"])
      .default("-")
      .optional(),
    relacaoCalculadaAtxBt: z.coerce
      .number()
      .min(1, "Minimo 1 dígito")
      .max(100, "Máximo 100 dígitos.")
      .nullable()
      .optional(),
    relacaoMedida1: z.coerce
      .number()
      .min(1, "Minimo 1 dígito")
      .max(100, "Máximo 100 dígitos.")
      .nullable()
      .optional(),
    relacaoMedida2: z.coerce
      .number()
      .min(1, "Minimo 1 dígito")
      .max(100, "Máximo 100 dígitos.")
      .nullable()
      .optional(),
    relacaoMedida3: z.coerce
      .number()
      .min(1, "Minimo 1 dígito")
      .max(100, "Máximo 100 dígitos.")
      .nullable()
      .optional(),
    resistenciaOhmicaEnrolamentoAt1: z.coerce
      .number()
      .min(1, "Minimo 1 dígito")
      .max(100, "Máximo 100 dígitos.")
      .nullable()
      .optional(),
    resistenciaOhmicaEnrolamentoAt2: z.coerce
      .number()
      .min(1, "Minimo 1 dígito")
      .max(100, "Máximo 100 dígitos.")
      .nullable()
      .optional(),
    resistenciaOhmicaEnrolamentoAt3: z.coerce
      .number()
      .min(1, "Minimo 1 dígito")
      .max(100, "Máximo 100 dígitos.")
      .nullable()
      .optional(),
    resistenciaOhmicaEnrolamentoBt1: z.coerce
      .number()
      .min(1, "Minimo 1 dígito")
      .max(100, "Máximo 100 dígitos.")
      .nullable()
      .optional(),
    resistenciaOhmicaEnrolamentoBt2: z.coerce
      .number()
      .min(1, "Minimo 1 dígito")
      .max(100, "Máximo 100 dígitos.")
      .nullable()
      .optional(),
    resistenciaOhmicaEnrolamentoBt3: z.coerce
      .number()
      .min(1, "Minimo 1 dígito")
      .max(100, "Máximo 100 dígitos.")
      .nullable()
      .optional(),
    tensaoEnsaio: z.coerce
      .number()
      .min(1, "Minimo 1 dígito")
      .max(5000, "Máximo 5000 dígitos.")
      .nullable()
      .optional(),
    tempoEnsaio: z.coerce
      .number()
      .min(1, "Minimo 1 dígito")
      .max(60, "Máximo 60 dígitos.")
      .nullable()
      .optional(),
    resistenciaIsolamentoAtxBt: z.coerce
      .number()
      .min(1, "Minimo 1 dígito")
      .max(5, "Máximo 5 dígitos.")
      .nullable()
      .optional(),
    resistenciaIsolamentoAtxMassa: z.coerce
      .number()
      .min(1, "Minimo 1 dígito")
      .max(5, "Máximo 5 dígitos.")
      .nullable()
      .optional(),
    resistenciaIsolamentoBtxMassa: z.coerce
      .number()
      .min(1, "Minimo 1 dígito")
      .max(5, "Máximo 5 dígitos.")
      .nullable()
      .optional(),

    correnteN1: z
      .number()
      .min(1, "Minimo 1 dígito")
      .max(100, "Máximo 100 dígitos.")
      .nullable()
      .optional(),
    correnteN2: z
      .number()
      .min(1, "Minimo 1 dígito")
      .max(100, "Máximo 100 dígitos.")
      .nullable()
      .optional(),
    correnteN3: z
      .number()
      .min(1, "Minimo 1 dígito")
      .max(100, "Máximo 100 dígitos.")
      .nullable()
      .optional(),
    correnteN4: z
      .number()
      .min(1, "Minimo 1 dígito")
      .max(100, "Máximo 100 dígitos.")
      .nullable()
      .optional(),
    correnteN5: z
      .number()
      .min(1, "Minimo 1 dígito")
      .max(100, "Máximo 100 dígitos.")
      .nullable()
      .optional(),
    correnteN6: z
      .number()
      .min(1, "Minimo 1 dígito")
      .max(100, "Máximo 100 dígitos.")
      .nullable()
      .optional(),

    wattsN1: z
      .number()
      .min(1, "Minimo 1 dígito")
      .max(100, "Máximo 100 dígitos.")
      .nullable()
      .optional(),
    wattsN2: z
      .number()
      .min(1, "Minimo 1 dígito")
      .max(100, "Máximo 100 dígitos.")
      .nullable()
      .optional(),
    wattsN3: z
      .number()
      .min(1, "Minimo 1 dígito")
      .max(100, "Máximo 100 dígitos.")
      .nullable()
      .optional(),
    wattsN4: z
      .number()
      .min(1, "Minimo 1 dígito")
      .max(100, "Máximo 100 dígitos.")
      .nullable()
      .optional(),
    wattsN5: z
      .number()
      .min(1, "Minimo 1 dígito")
      .max(100, "Máximo 100 dígitos.")
      .nullable()
      .optional(),
    wattsN6: z
      .number()
      .min(1, "Minimo 1 dígito")
      .max(100, "Máximo 100 dígitos.")
      .nullable()
      .optional(),

    fatorPotenciaN1: z
      .number()
      .min(1, "Minimo 1 dígito")
      .max(100, "Máximo 100 dígitos.")
      .nullable()
      .optional(),
    fatorPotenciaN2: z
      .number()
      .min(1, "Minimo 1 dígito")
      .max(100, "Máximo 100 dígitos.")
      .nullable()
      .optional(),
    fatorPotenciaN3: z
      .number()
      .min(1, "Minimo 1 dígito")
      .max(100, "Máximo 100 dígitos.")
      .nullable()
      .optional(),
    fatorPotenciaN4: z
      .number()
      .min(1, "Minimo 1 dígito")
      .max(100, "Máximo 100 dígitos.")
      .nullable()
      .optional(),
    fatorPotenciaN5: z
      .number()
      .min(1, "Minimo 1 dígito")
      .max(100, "Máximo 100 dígitos.")
      .nullable()
      .optional(),
    fatorPotenciaN6: z
      .number()
      .min(1, "Minimo 1 dígito")
      .max(100, "Máximo 100 dígitos.")
      .nullable()
      .optional(),

    capacitanciaN1: z
      .number()
      .min(1, "Minimo 1 dígito")
      .max(100, "Máximo 100 dígitos.")
      .nullable()
      .optional(),
    capacitanciaN2: z
      .number()
      .min(1, "Minimo 1 dígito")
      .max(100, "Máximo 100 dígitos.")
      .nullable()
      .optional(),
    capacitanciaN3: z
      .number()
      .min(1, "Minimo 1 dígito")
      .max(100, "Máximo 100 dígitos.")
      .nullable()
      .optional(),
    capacitanciaN4: z
      .number()
      .min(1, "Minimo 1 dígito")
      .max(100, "Máximo 100 dígitos.")
      .nullable()
      .optional(),
    capacitanciaN5: z
      .number()
      .min(1, "Minimo 1 dígito")
      .max(100, "Máximo 100 dígitos.")
      .nullable()
      .optional(),
    capacitanciaN6: z
      .number()
      .min(1, "Minimo 1 dígito")
      .max(100, "Máximo 100 dígitos.")
      .nullable()
      .optional(),

    numeroSerieBucha1: z
      .string()
      .min(1, "Mínimo de 1 caractere.")
      .max(100, "Máximo de 100 caracteres.")
      .nullable()
      .optional(),
    numeroSerieBucha2: z
      .string()
      .min(1, "Mínimo de 1 caractere.")
      .max(100, "Máximo de 100 caracteres.")
      .nullable()
      .optional(),
    numeroSerieBucha3: z
      .string()
      .min(1, "Mínimo de 1 caractere.")
      .max(100, "Máximo de 100 caracteres.")
      .nullable()
      .optional(),

    correnteBucha1: z
      .number()
      .min(1, "Minimo 1 dígito")
      .max(100, "Máximo 100 dígitos.")
      .nullable()
      .optional(),
    correnteBucha2: z
      .number()
      .min(1, "Minimo 1 dígito")
      .max(100, "Máximo 100 dígitos.")
      .nullable()
      .optional(),
    correnteBucha3: z
      .number()
      .min(1, "Minimo 1 dígito")
      .max(100, "Máximo 100 dígitos.")
      .nullable()
      .optional(),

    wattsBucha1: z
      .number()
      .min(1, "Minimo 1 dígito")
      .max(100, "Máximo 100 dígitos.")
      .nullable()
      .optional(),
    wattsBucha2: z
      .number()
      .min(1, "Minimo 1 dígito")
      .max(100, "Máximo 100 dígitos.")
      .nullable()
      .optional(),
    wattsBucha3: z
      .number()
      .min(1, "Minimo 1 dígito")
      .max(100, "Máximo 100 dígitos.")
      .nullable()
      .optional(),
    fatorPotenciaCorrente: z
      .number()
      .min(1, "Minimo 1 dígito")
      .max(100, "Máximo 100 dígitos.")
      .nullable()
      .optional(),
    fatorPotenciaBucha1: z
      .number()
      .min(1, "Minimo 1 dígito")
      .max(100, "Máximo 100 dígitos.")
      .nullable()
      .optional(),
    fatorPotenciaBucha2: z
      .number()
      .min(1, "Minimo 1 dígito")
      .max(100, "Máximo 100 dígitos.")
      .nullable()
      .optional(),
    fatorPotenciaBucha3: z
      .number()
      .min(1, "Minimo 1 dígito")
      .max(100, "Máximo 100 dígitos.")
      .nullable()
      .optional(),

    capacitanciaBucha1: z
      .number()
      .min(1, "Minimo 1 dígito")
      .max(100, "Máximo 100 dígitos.")
      .nullable()
      .optional(),
    capacitanciaBucha2: z
      .number()
      .min(1, "Minimo 1 dígito")
      .max(100, "Máximo 100 dígitos.")
      .nullable()
      .optional(),
    capacitanciaBucha3: z
      .number()
      .min(1, "Minimo 1 dígito")
      .max(100, "Máximo 100 dígitos.")
      .nullable()
      .optional(),

    correnteH1H3: z
      .number()
      .min(1, "Minimo 1 dígito")
      .max(5, "Máximo 5 dígitos.")
      .nullable()
      .optional(),
    correnteH2H1: z
      .number()
      .min(1, "Minimo 1 dígito")
      .max(5, "Máximo 5 dígitos.")
      .nullable()
      .optional(),
    correnteH3H2: z
      .number()
      .min(1, "Minimo 1 dígito")
      .max(5, "Máximo 5 dígitos.")
      .nullable()
      .optional(),

    avaliacao: z.enum(["CONFORME", "NAO_CONFORME"]).optional(),
    descricaoAvaliacao: z
      .string()
      .max(500, "Máximo 500 caracteres.")
      .optional(),

    observacao: z
      .string()
      .max(100, "Resuma em no máximo 100 caracteres.")
      .optional(),
  })
  .strict();
const trafoCorrenteSchema = z
  .object({
    correnteNominalAt: z.coerce
      .number()
      .max(99999, "Máximo 99999 dígitos.")
      .nullable()
      .optional(),
    correnteNominalBt: z.coerce
      .number()
      .max(99999, "Máximo 99999 dígitos.")
      .nullable()
      .optional(),
    correntePrimario: z.coerce
      .number()
      .max(99999, "Máximo 99999 dígitos.")
      .nullable()
      .optional(),
    correnteSecundario: z.coerce
      .number()
      .max(99999, "Máximo 99999 dígitos.")
      .nullable()
      .optional(),
    terminalMedicao: z
      .string()
      .max(100, "Máximo 100 caracteres.")
      .nullable()
      .optional(),
    relacaoCalculada: z.coerce
      .number()
      .max(99999, "Máximo 99999 dígitos.")
      .nullable()
      .optional(),
    relacaoMedida: z.coerce
      .number()
      .max(99999, "Máximo 99999 dígitos.")
      .nullable()
      .optional(),
    relacaoOhmica: z.coerce
      .number()
      .max(99999, "Máximo 99999 dígitos.")
      .nullable()
      .optional(),
    temperaturaEnsaio: z.coerce
      .number()
      .max(99999, "Máximo 99999 dígitos.")
      .nullable()
      .optional(),
    resistenciaIsolamentoPxS: z.coerce
      .number()
      .max(99999, "Máximo 99999 dígitos.")
      .nullable()
      .optional(),
    resistenciaIsolamentoPxMassa: z.coerce
      .number()
      .max(99999, "Máximo 99999 dígitos.")
      .nullable()
      .optional(),
    resistenciaIsolamentoSxMassa: z.coerce
      .number()
      .max(99999, "Máximo 99999 dígitos.")
      .nullable()
      .optional(),
    avaliacao: z.enum(["CONFORME", "NAO_CONFORME"]).optional(),
    descricaoAvaliacao: z
      .string()
      .max(500, "Máximo 500 caracteres.")
      .optional(),
    observacao: z.string().optional(),
  })
  .strict();
const disjuntorSchema = z
  .object({
    resistenciaContatoFechadoA: z.coerce
      .number()
      .min(1, "Minimo 1 dígito")
      .max(1000, "Máximo 1000 dígitos.")
      .nullable()
      .optional(),
    resistenciaContatoFechadoB: z.coerce
      .number()
      .min(1, "Minimo 1 dígito")
      .max(1000, "Máximo 1000 dígitos.")
      .nullable()
      .optional(),
    resistenciaContatoFechadoC: z.coerce
      .number()
      .min(1, "Minimo 1 dígito")
      .max(1000, "Máximo 1000 dígitos.")
      .nullable()
      .optional(),

    resistenciaContatoAbertoA: z.coerce
      .number()
      .min(1, "Minimo 1 dígito")
      .max(1000, "Máximo 1000 dígitos.")
      .nullable()
      .optional(),
    resistenciaContatoAbertoB: z.coerce
      .number()
      .min(1, "Minimo 1 dígito")
      .max(1000, "Máximo 1000 dígitos.")
      .nullable()
      .optional(),
    resistenciaContatoAbertoC: z.coerce
      .number()
      .min(1, "Minimo 1 dígito")
      .max(1000, "Máximo 1000 dígitos.")
      .nullable()
      .optional(),

    resistenciaIsolamentoAbertoA: z.coerce
      .number()
      .min(1, "Minimo 1 dígito")
      .max(1000, "Máximo 1000 dígitos.")
      .nullable()
      .optional(),
    resistenciaIsolamentoAbertoB: z.coerce
      .number()
      .min(1, "Minimo 1 dígito")
      .max(1000, "Máximo 1000 dígitos.")
      .nullable()
      .optional(),
    resistenciaIsolamentoAbertoC: z.coerce
      .number()
      .min(1, "Minimo 1 dígito")
      .max(1000, "Máximo 1000 dígitos.")
      .nullable()
      .optional(),

    resistenciaIsolamentoAxMassa: z.coerce
      .number()
      .min(1, "Minimo 1 dígito")
      .max(1000, "Máximo 1000 dígitos.")
      .nullable()
      .optional(),
    resistenciaIsolamentoBxMassa: z.coerce
      .number()
      .min(1, "Minimo 1 dígito")
      .max(1000, "Máximo 1000 dígitos.")
      .nullable()
      .optional(),
    resistenciaIsolamentoCxMassa: z.coerce
      .number()
      .min(1, "Minimo 1 dígito")
      .max(1000, "Máximo 1000 dígitos.")
      .nullable()
      .optional(),
    correntePoloAbertoA: z
      .number()
      .min(1, "Minimo 1 dígito")
      .max(100, "Máximo 100 dígitos.")
      .nullable()
      .optional(),
    correntePoloAbertoB: z
      .number()
      .min(1, "Minimo 1 dígito")
      .max(100, "Máximo 100 dígitos.")
      .nullable()
      .optional(),
    correntePoloAbertoC: z
      .number()
      .min(1, "Minimo 1 dígito")
      .max(100, "Máximo 100 dígitos.")
      .nullable()
      .optional(),
    wattsPoloAbertoA: z
      .number()
      .min(1, "Minimo 1 dígito")
      .max(100, "Máximo 100 dígitos.")
      .nullable()
      .optional(),
    wattsPoloAbertoB: z
      .number()
      .min(1, "Minimo 1 dígito")
      .max(100, "Máximo 100 dígitos.")
      .nullable()
      .optional(),
    wattsPoloAbertoC: z
      .number()
      .min(1, "Minimo 1 dígito")
      .max(100, "Máximo 100 dígitos.")
      .nullable()
      .optional(),
    fatorPotenciaPoloAbertoA: z
      .number()
      .min(1, "Minimo 1 dígito")
      .max(100, "Máximo 100 dígitos.")
      .nullable()
      .optional(),
    fatorPotenciaPoloAbertoB: z
      .number()
      .min(1, "Minimo 1 dígito")
      .max(100, "Máximo 100 dígitos.")
      .nullable()
      .optional(),
    fatorPotenciaPoloAbertoC: z
      .number()
      .min(1, "Minimo 1 dígito")
      .max(100, "Máximo 100 dígitos.")
      .nullable()
      .optional(),
    capacitanciaPoloAbertoA: z
      .number()
      .min(1, "Minimo 1 dígito")
      .max(10000, "Máximo 10000 dígitos.")
      .nullable()
      .optional(),
    capacitanciaPoloAbertoB: z
      .number()
      .min(1, "Minimo 1 dígito")
      .max(10000, "Máximo 10000 dígitos.")
      .nullable()
      .optional(),
    capacitanciaPoloAbertoC: z
      .number()
      .min(1, "Minimo 1 dígito")
      .max(10000, "Máximo 10000 dígitos.")
      .nullable()
      .optional(),
    correntePoloFechadoA: z
      .number()
      .min(1, "Minimo 1 dígito")
      .max(100, "Máximo 100 dígitos.")
      .nullable()
      .optional(),
    correntePoloFechadoB: z
      .number()
      .min(1, "Minimo 1 dígito")
      .max(100, "Máximo 100 dígitos.")
      .nullable()
      .optional(),
    correntePoloFechadoC: z
      .number()
      .min(1, "Minimo 1 dígito")
      .max(100, "Máximo 100 dígitos.")
      .nullable()
      .optional(),
    wattsPoloFechadoA: z
      .number()
      .min(1, "Minimo 1 dígito")
      .max(100, "Máximo 100 dígitos.")
      .nullable()
      .optional(),
    wattsPoloFechadoB: z
      .number()
      .min(1, "Minimo 1 dígito")
      .max(100, "Máximo 100 dígitos.")
      .nullable()
      .optional(),
    wattsPoloFechadoC: z
      .number()
      .min(1, "Minimo 1 dígito")
      .max(100, "Máximo 100 dígitos.")
      .nullable()
      .optional(),
    fatorPotenciaPoloFechadoA: z
      .number()
      .min(1, "Minimo 1 dígito")
      .max(100, "Máximo 100 dígitos.")
      .nullable()
      .optional(),
    fatorPotenciaPoloFechadoB: z
      .number()
      .min(1, "Minimo 1 dígito")
      .max(100, "Máximo 100 dígitos.")
      .nullable()
      .optional(),
    fatorPotenciaPoloFechadoC: z
      .number()
      .min(1, "Minimo 1 dígito")
      .max(100, "Máximo 100 dígitos.")
      .nullable()
      .optional(),
    capacitanciaPoloFechadoA: z
      .number()
      .min(1, "Minimo 1 dígito")
      .max(10000, "Máximo 10000 dígitos.")
      .nullable()
      .optional(),
    capacitanciaPoloFechadoB: z
      .number()
      .min(1, "Minimo 1 dígito")
      .max(10000, "Máximo 10000 dígitos.")
      .nullable()
      .optional(),
    capacitanciaPoloFechadoC: z
      .number()
      .min(1, "Minimo 1 dígito")
      .max(10000, "Máximo 10000 dígitos.")
      .nullable()
      .optional(),
    servico1: z
      .enum(["SIM", "NAO", "N/A"], {
        required_error: "É obrigatório informar se o serviço 1 foi realizado.",
        invalid_type_error: "Serviço 1 inválido.",
      })
      .optional(),
    servico2: z
      .enum(["SIM", "NAO", "N/A"], {
        required_error: "É obrigatório informar se o serviço 2 foi realizado.",
        invalid_type_error: "Serviço 2 inválido.",
      })
      .optional(),
    servico3: z
      .enum(["SIM", "NAO", "N/A"], {
        required_error: "É obrigatório informar se o serviço 3 foi realizado.",
        invalid_type_error: "Serviço 3 inválido.",
      })
      .optional(),
    servico4: z
      .enum(["SIM", "NAO", "N/A"], {
        required_error: "É obrigatório informar se o serviço 4 foi realizado.",
        invalid_type_error: "Serviço 4 inválido.",
      })
      .optional(),
    avaliacao: z.enum(["CONFORME", "NAO_CONFORME"]).optional(),
    descricaoAvaliacao: z
      .string()
      .max(500, "Máximo 500 caracteres.")
      .optional(),

    observacao: z
      .string()
      .max(100, "Resuma em no máximo 100 caracteres.")
      .optional(),
  })
  .strict();

const malhaAterramentoSchema = z.object({
  // Corrigido para aceitar um valor maior e ser nulo/opcional
  valorResistencia: z
    .number({ invalid_type_error: "O valor deve ser um número." })
    .min(0, "O valor não pode ser negativo.")
    .max(99999, "O valor excede o limite máximo.")
    .nullable()
    .optional(),

  observacao: z
    .string()
    .max(100, "Resuma em no máximo 100 caracteres.")
    .optional(),

  avaliacao: z.enum(["CONFORME", "NAO_CONFORME"]).optional(),
  descricaoAvaliacao: z.string().max(500, "Máximo 500 caracteres.").optional(),
  servico1: z.enum(["SIM", "NAO", "N/A"]).optional(),
  servico2: z.enum(["SIM", "NAO", "N/A"]).optional(),
});
const resistorAterramentoSchema = z.object({
  // Corrigido para aceitar nulo e ser opcional
  resistenciaNominal: z.number().max(99999).nullable().optional(),
  resistenciaOhmicaMedida: z.number().max(99999).nullable().optional(),
  resistenciaIsolamento: z.number().max(99999).nullable().optional(),

  // Corrigido para ser opcional
  observacao: z
    .string()
    .max(100, "Resuma em no máximo 100 caracteres.")
    .optional(),

  // Campos restantes mantidos como opcionais
  avaliacao: z.enum(["CONFORME", "NAO_CONFORME"]).optional(),
  descricaoAvaliacao: z.string().max(500, "Máximo 500 caracteres.").optional(),
});

const chaveSeccionadoraSchema = z.object({
  correnteAplicada: z
    .number()
    .min(1, "Minimo 1 dígito")
    .max(100, "Máximo 100 dígitos.")
    .optional(),
  tensaoEnsaio: z
    .number()
    .min(1, "Minimo 1 dígito")
    .max(100, "Máximo 100 dígitos.")
    .optional(),
  valorReferencia1: z
    .number()
    .min(1, "Minimo 1 dígito")
    .max(300, "Máximo 300 dígitos.")
    .optional(),
  valorReferencia2: z
    .number()
    .min(1, "Minimo 1 dígito")
    .max(1000, "Máximo 1000 dígitos.")
    .optional(),
  tempo: z
    .number()
    .min(1, "Minimo 1 dígito")
    .max(60, "Máximo 60 dígitos.")
    .optional(),

  resistenciaContatoA: z.number().min(1).max(1000).nullable().optional(),
  resistenciaContatoB: z.number().min(1).max(1000).nullable().optional(),
  resistenciaContatoC: z.number().min(1).max(1000).nullable().optional(),
  resistenciaIsolamentoA: z.number().min(1).max(5000).nullable().optional(),
  resistenciaIsolamentoB: z.number().min(1).max(5000).nullable().optional(),
  resistenciaIsolamentoC: z.number().min(1).max(5000).nullable().optional(),

  servico1: z.enum(["SIM", "NAO", "N/A"]).optional(),
  servico2: z.enum(["SIM", "NAO", "N/A"]).optional(),
  servico3: z.enum(["SIM", "NAO", "N/A"]).optional(),
  servico4: z.enum(["SIM", "NAO", "N/A"]).optional(),

  avaliacao: z.enum(["CONFORME", "NAO_CONFORME"]).optional(),
  descricaoAvaliacao: z.string().max(500, "Máximo 500 caracteres.").optional(),

  // Removendo a exigência de ser um campo obrigatório
  observacao: z
    .string()
    .max(100, "Resuma em no máximo 100 caracteres.")
    .optional(),
  // ===================================================================
  //                        FIM DAS CORREÇÕES
  // ===================================================================
});

// Fazendo
const caboMuflaSchema = z.object({
  tensaoEnsaio: z.coerce
    .number()
    .max(6000, "Máximo 6000 dígitos.")
    .nullable()
    .optional(),
  valorReferencia: z
    .number()
    .max(6000, "Máximo 6000 dígitos.")
    .nullable()
    .optional(),
  tempoEnsaio: z.coerce.number().max(60, "Máximo 60.").nullable().optional(),
  resistenciaIsolamentoX0xMassa: z
    .number()
    .max(6000, "Máximo 6000 dígitos.")
    .nullable()
    .optional(),
  resistenciaIsolamentoX11xMassa: z
    .number()
    .max(6000, "Máximo 6000 dígitos.")
    .nullable()
    .optional(),
  resistenciaIsolamentoX12xMassa: z
    .number()
    .max(6000, "Máximo 6000 dígitos.")
    .nullable()
    .optional(),
  resistenciaIsolamentoX21xMassa: z
    .number()
    .max(6000, "Máximo 6000 dígitos.")
    .nullable()
    .optional(),
  resistenciaIsolamentoX22xMassa: z
    .number()
    .max(6000, "Máximo 6000 dígitos.")
    .nullable()
    .optional(),
  resistenciaIsolamentoX31xMassa: z
    .number()
    .max(6000, "Máximo 6000 dígitos.")
    .nullable()
    .optional(),
  resistenciaIsolamentoX32xMassa: z
    .number()
    .max(6000, "Máximo 6000 dígitos.")
    .nullable()
    .optional(),

  servico1: z
    .enum(["SIM", "NAO", "N/A"], {
      required_error: "É obrigatório informar se o serviço 1 foi realizado.",
      invalid_type_error: "Serviço 1 inválido.",
    })
    .optional(),
  servico2: z
    .enum(["SIM", "NAO", "N/A"], {
      required_error: "É obrigatório informar se o serviço 2 foi realizado.",
      invalid_type_error: "Serviço 2 inválido.",
    })
    .optional(),
  servico3: z
    .enum(["SIM", "NAO", "N/A"], {
      required_error: "É obrigatório informar se o serviço 3 foi realizado.",
      invalid_type_error: "Serviço 3 inválido.",
    })
    .optional(),

  avaliacao: z.enum(["CONFORME", "NAO_CONFORME"]).optional(),
  descricaoAvaliacao: z.string().max(500, "Máximo 500 caracteres.").optional(),

  observacao: z
    .string()
    .max(100, "Resuma em no máximo 100 caracteres.")
    .optional(),
});
// Feito
const fpTrafoSchema = z
  .object({
    correnteN1: z
      .number()
      .min(1, "Minimo 1 dígito")
      .max(100, "Máximo 100 dígitos.")
      .optional(),
    correnteN2: z
      .number()
      .min(1, "Minimo 1 dígito")
      .max(100, "Máximo 100 dígitos.")
      .optional(),
    correnteN3: z
      .number()
      .min(1, "Minimo 1 dígito")
      .max(100, "Máximo 100 dígitos.")
      .optional(),
    correnteN4: z
      .number()
      .min(1, "Minimo 1 dígito")
      .max(100, "Máximo 100 dígitos.")
      .optional(),
    correnteN5: z
      .number()
      .min(1, "Minimo 1 dígito")
      .max(100, "Máximo 100 dígitos.")
      .optional(),
    correnteN6: z
      .number()
      .min(1, "Minimo 1 dígito")
      .max(100, "Máximo 100 dígitos.")
      .optional(),

    wattsN1: z
      .number()
      .min(1, "Minimo 1 dígito")
      .max(100, "Máximo 100 dígitos.")
      .optional(),
    wattsN2: z
      .number()
      .min(1, "Minimo 1 dígito")
      .max(100, "Máximo 100 dígitos.")
      .optional(),
    wattsN3: z
      .number()
      .min(1, "Minimo 1 dígito")
      .max(100, "Máximo 100 dígitos.")
      .optional(),
    wattsN4: z
      .number()
      .min(1, "Minimo 1 dígito")
      .max(100, "Máximo 100 dígitos.")
      .optional(),
    wattsN5: z
      .number()
      .min(1, "Minimo 1 dígito")
      .max(100, "Máximo 100 dígitos.")
      .optional(),
    wattsN6: z
      .number()
      .min(1, "Minimo 1 dígito")
      .max(100, "Máximo 100 dígitos.")
      .optional(),

    fatorPotenciaN1: z
      .number()
      .min(1, "Minimo 1 dígito")
      .max(100, "Máximo 100 dígitos.")
      .optional(),
    fatorPotenciaN2: z
      .number()
      .min(1, "Minimo 1 dígito")
      .max(100, "Máximo 100 dígitos.")
      .optional(),
    fatorPotenciaN3: z
      .number()
      .min(1, "Minimo 1 dígito")
      .max(100, "Máximo 100 dígitos.")
      .optional(),
    fatorPotenciaN: z
      .number()
      .min(1, "Minimo 1 dígito")
      .max(100, "Máximo 100 dígitos.")
      .optional(),
    fatorPotenciaN5: z
      .number()
      .min(1, "Minimo 1 dígito")
      .max(100, "Máximo 100 dígitos.")
      .optional(),
    fatorPotenciaN6: z
      .number()
      .min(1, "Minimo 1 dígito")
      .max(100, "Máximo 100 dígitos.")
      .optional(),

    capacitanciaN1: z
      .number()
      .min(1, "Minimo 1 dígito")
      .max(100, "Máximo 100 dígitos.")
      .optional(),
    capacitanciaN2: z
      .number()
      .min(1, "Minimo 1 dígito")
      .max(100, "Máximo 100 dígitos.")
      .optional(),
    capacitanciaN3: z
      .number()
      .min(1, "Minimo 1 dígito")
      .max(100, "Máximo 100 dígitos.")
      .optional(),
    capacitanciaN4: z
      .number()
      .min(1, "Minimo 1 dígito")
      .max(100, "Máximo 100 dígitos.")
      .optional(),
    capacitanciaN5: z
      .number()
      .min(1, "Minimo 1 dígito")
      .max(100, "Máximo 100 dígitos.")
      .optional(),
    capacitanciaN6: z
      .number()
      .min(1, "Minimo 1 dígito")
      .max(100, "Máximo 100 dígitos.")
      .optional(),
  })
  .strict();
// Feito
const tpBuchaSchema = z
  .object({
    numeroSerieBucha: z
      .string()
      .min(1, "Minimo 1 dígito")
      .max(5, "Máximo 5 dígitos.")
      .optional(),
    corrente: z
      .number()
      .min(1, "Minimo 1 dígito")
      .max(5, "Máximo 5 dígitos.")
      .optional(),
    watts: z
      .number()
      .min(1, "Minimo 1 dígito")
      .max(5, "Máximo 5 dígitos.")
      .optional(),
    fatorPotencia: z
      .number()
      .min(1, "Minimo 1 dígito")
      .max(5, "Máximo 5 dígitos.")
      .optional(),
    capacitancia: z
      .number()
      .min(1, "Minimo 1 dígito")
      .max(5, "Máximo 5 dígitos.")
      .optional(),
  })
  .strict();
// Feito
const correnteExcitacao = z
  .object({
    correnteH1H3: z
      .number()
      .min(1, "Minimo 1 dígito")
      .max(5, "Máximo 5 dígitos.")
      .optional(),
    correnteH2H1: z
      .number()
      .min(1, "Minimo 1 dígito")
      .max(5, "Máximo 5 dígitos.")
      .optional(),
    correnteH3H2: z
      .number()
      .min(1, "Minimo 1 dígito")
      .max(5, "Máximo 5 dígitos.")
      .optional(),
  })
  .strict();
// Schema por tipo
export const schemasPorTipo = {
  TRAFO_ALTA: trafoAltaSchema,
  TRAFO_MEDIA: trafoPotenciaSchema,
  TRAFO_CORRENTE: trafoCorrenteSchema,
  TRAFO_POTENCIA: trafoPotenciaSchema,
  TRAFO_FORCA: trafoPotenciaSchema,
  DISJUNTOR_ALTA: disjuntorSchema,
  DISJUNTOR_MEDIA: disjuntorSchema,
  DISJUNTOR_BAIXA: disjuntorSchema,
  RESISTOR: resistorAterramentoSchema,
  CHAVE_SECCIONADORA: chaveSeccionadoraSchema,
  CHAVE_SECCIONADORA_ALTA: chaveSeccionadoraSchema,
  CHAVE_SECCIONADORA_MEDIA: chaveSeccionadoraSchema,
  MALHA: malhaAterramentoSchema,
  BUCHA: tpBuchaSchema,
  CABOMUFLA: caboMuflaSchema,
};
