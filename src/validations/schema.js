import { z } from "zod";

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
    usuario: z.string().min(3, "Usuário é obrigatório"),
    matricula: z.preprocess(
      (val) => Number(val),
      z
        .number()
        .int()
        .positive("Matrícula inválida, deve ser um número inteiro e positivo.")
    ),
    cargo: z.string().min(2, "Cargo é obrigatório"),
    admissao: z.string().refine((val) => !isNaN(Date.parse(val)), {
      message: "Data de admissão inválida",
    }),
    senha: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
    nivelAcesso: z.enum(["ADMIN", "SUPERVISOR", "TECNICO"]).optional(),
  })
  .strict();

export const atualizarDadosFuncionarioSchema = z
  .object({
    nome: z.string().min(3).optional(),
    usuario: z.string().min(3).optional(),
    matricula: z
      .preprocess((val) => Number(val), z.number().int().positive())
      .optional(),
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
    contato: z.string().min(1),
    email: z.string().email(),
    localServico: z.string().min(1),
    descricaoInicial: z.string().min(1),
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

    supervisorMatricula: z.preprocess(
      (val) => String(val).trim(),
      z.string().regex(/^\d+$/, "A matrícula deve conter apenas números")
    ),
    tecnicoMatricula: z
      .array(
        z.preprocess(
          (val) => Number(val), // converte string para número
          z
            .number()
            .int()
            .positive("A matrícula deve ser um número inteiro positivo")
        )
      )
      .optional(),
  })
  .strict();

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

export const adicionarSubestacaoSchema = z
  .object({
    numeroOs: z.string().min(1),
    matricula: z.string().min(1),
  })
  .strict();

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
    })
    .strict(),
  query: z.object({}).optional(),
});

export const atualizarComponenteSchema = z.object({
  params: z
    .object({
      matricula: z.coerce.number(),
      numeroOs: z.string(),
      subestacaoId: z.coerce.number(),
      componenteId: z.coerce.number(),
    })
    .strict(),
  body: z
    .object({
      nomeEquipamento: z.string().optional(),
      cliente: z.string().optional(),
      tag: z.string().optional(),
      localizacao: z.string().optional(),
      tipo: z
        .enum([
          "TRAFO_ALTA",
          "TRAFO_MEDIA",
          "TRAFO_CORRENTE",
          "TRAFO_POTENCIA",
          "TRAFO_FORCA",
          "DISJUNTOR_ALTA",
          "DISJUNTO_MEDIA",
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
      tipoTensaoAt: z.string().optional(),
      tensaoAt: z.coerce.number().optional(),
      tipoTensaoBt: z.string().optional(),
      tensaoBt: z.coerce.number().optional(),
      volumeOleoIsolante: z.coerce.number().optional(),
      temperaturaEnsaio: z.coerce.number().optional(),
      umidadeRelativaAr: z.coerce.number().optional(),
      exatidao: z.coerce.number().optional(),
      circuito: z.coerce.number().optional(),
      tipoPressao: z.string().optional(),
      pressao: z.coerce.number().optional(),
      bitolaCabo: z.coerce.number().optional(),
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
    body: z.object({
      tipo: z.enum([
        "TRAFO_POTENCIA",
        "TRAFO_CORRENTE",
        "DISJUNTOR",
        "RESISTOR",
        "CHAVE_SECCIONADORA",
        "MALHA_ATERRAMENTO",
        "MEDICAO_CABO_MUFLA",
        "FP_TRAFO",
        "FP_BUCHA",
        "CORRENTE_EXCITACAO",
        "OUTRO",
      ]),
      data: z.any(),
      equipamentoUsado: z.array(
        z.coerce
          .number()
          .min(1, "OS deve possuir no mínimo 1 dígito.")
          .max(5, "OS deve possuir no máximo 5 dígitos.")
      ),
      foto: z.array(z.string().url()).optional(),
    }).strict(),
    params: z.object({
      matricula: z.string().regex(/^\d+$/), // ou .transform(Number) se preferir
      numeroOs: z
        .string()
        .min(1, "OS deve possuir no mínimo 1 dígito.")
        .max(5, "OS deve possuir no máximo 5 dígitos."),
      subestacaoId: z.coerce
        .number()
        .min(1, "OS deve possuir no mínimo 1 dígito.")
        .max(50, "OS deve possuir no máximo 50 dígitos."),
      componenteId: z.coerce
        .number()
        .min(1, "OS deve possuir no mínimo 1 dígito.")
        .max(50, "OS deve possuir no máximo 50 dígitos."),
    }),
    query: z.object({}).optional(), // se houver filtros, coloque aqui
  })
  .strict();
// Schemas por tipo de ensaio
const trafoPotenciaSchema = z
  .object({
    tapComutadorAt: z.coerce
      .number()
      .min(1, "Minimo 1 dígito")
      .max(4, "Máximo 4 dígitos.")
      .optional(),
    tapComutadorBt: z.coerce
      .number()
      .min(1, "Minimo 1 dígito")
      .max(4, "Máximo 4 dígitos.")
      .optional(),
    tensaoAt: z.coerce
      .number()
      .min(1, "Minimo 1 dígito")
      .max(70000, "Máximo 70000 dígitos.")
      .optional(),
    tensaoBt: z.coerce
      .number()
      .min(1, "Minimo 1 dígito")
      .max(14000, "Máximo 14000 dígitos.")
      .optional(),
    relacaoCalculadaAtxBt: z.coerce
      .number()
      .min(1, "Minimo 1 dígito")
      .max(100, "Máximo 100 dígitos.")
      .optional(),
    relacaoMedida1: z.coerce
      .number()
      .min(1, "Minimo 1 dígito")
      .max(100, "Máximo 100 dígitos.")
      .optional(),
    relacaoMedida2: z.coerce
      .number()
      .min(1, "Minimo 1 dígito")
      .max(100, "Máximo 100 dígitos.")
      .optional(),
    relacaoMedida3: z.coerce
      .number()
      .min(1, "Minimo 1 dígito")
      .max(100, "Máximo 100 dígitos.")
      .optional(),
    resistenciaOhmicaEnrolamentoAt1: z.coerce
      .number()
      .min(1, "Minimo 1 dígito")
      .max(100, "Máximo 100 dígitos.")
      .optional(),
    resistenciaOhmicaEnrolamentoAt2: z.coerce
      .number()
      .min(1, "Minimo 1 dígito")
      .max(100, "Máximo 100 dígitos.")
      .optional(),
    resistenciaOhmicaEnrolamentoAt3: z.coerce
      .number()
      .min(1, "Minimo 1 dígito")
      .max(100, "Máximo 100 dígitos.")
      .optional(),
    resistenciaOhmicaEnrolamentoBt1: z.coerce
      .number()
      .min(1, "Minimo 1 dígito")
      .max(100, "Máximo 100 dígitos.")
      .optional(),
    resistenciaOhmicaEnrolamentoBt2: z.coerce
      .number()
      .min(1, "Minimo 1 dígito")
      .max(100, "Máximo 100 dígitos.")
      .optional(),
    resistenciaOhmicaEnrolamentoBt3: z.coerce
      .number()
      .min(1, "Minimo 1 dígito")
      .max(100, "Máximo 100 dígitos.")
      .optional(),
    resistenciaIsolamentoAtxBt: z.coerce
      .number()
      .min(1, "Minimo 1 dígito")
      .max(5, "Máximo 5 dígitos.")
      .optional(),
    resistenciaIsolamentoAtxMassa: z.coerce
      .number()
      .min(1, "Minimo 1 dígito")
      .max(5, "Máximo 5 dígitos.")
      .optional(),
    resistenciaIsolamentoBtxMassa: z.coerce
      .number()
      .min(1, "Minimo 1 dígito")
      .max(5, "Máximo 5 dígitos.")
      .optional(),
    observacao: z
      .string()
      .min(1, "Campo obrigatório")
      .max(100, "Resuma em no máximo 100 caracteres.")
      .optional(),
    protecao1: z
      .enum(["CONFORME", "NAO_CONFORME", "N/A"], {
        required_error: "É obrigatório informar se o serviço 1 foi realizado.",
        invalid_type_error: "Serviço 1 inválido.",
      })
      .optional(),
    protecao2: z
      .enum(["CONFORME", "NAO_CONFORME", "N/A"], {
        required_error: "É obrigatório informar se o serviço 2 foi realizado.",
        invalid_type_error: "Serviço 2 inválido.",
      })
      .optional(),
    protecao3: z
      .enum(["CONFORME", "NAO_CONFORME", "N/A"], {
        required_error: "É obrigatório informar se o serviço 3 foi realizado.",
        invalid_type_error: "Serviço 3 inválido.",
      })
      .optional(),
    protecao4: z
      .enum(["CONFORME", "NAO_CONFORME", "N/A"], {
        required_error: "É obrigatório informar se o serviço 4 foi realizado.",
        invalid_type_error: "Serviço 4 inválido.",
      })
      .optional(),
    protecao5: z
      .enum(["CONFORME", "NAO_CONFORME", "N/A"], {
        required_error: "É obrigatório informar se o serviço 5 foi realizado.",
        invalid_type_error: "Serviço 5 inválido.",
      })
      .optional(),
    protecao6: z
      .enum(["CONFORME", "NAO_CONFORME", "N/A"], {
        required_error: "É obrigatório informar se o serviço 6 foi realizado.",
        invalid_type_error: "Serviço 6 inválido.",
      })
      .optional(),
  })
  .strict();
// Feito
const trafoCorrenteSchema = z
  .object({
    correntePrimario: z.coerce
      .number()
      .min(1, "Minimo 1 dígito")
      .max(99999, "Máximo 99999 dígitos.")
      .optional(),
    correnteSecundario: z.coerce
      .number()
      .min(1, "Minimo 1 dígito")
      .max(99999, "Máximo 99999 dígitos.")
      .optional(),
    relacaoCalculada: z.coerce
      .number()
      .min(1, "Minimo 1 dígito")
      .max(99999, "Máximo 99999 dígitos.")
      .optional(),
    relacaoMedida: z.coerce
      .number()
      .min(1, "Minimo 1 dígito")
      .max(99999, "Máximo 99999 dígitos.")
      .optional(),
    relacaoOhmica: z.coerce
      .number()
      .min(1, "Minimo 1 dígito")
      .max(99999, "Máximo 99999 dígitos.")
      .optional(),
    temperaturaEnsaio: z.coerce
      .number()
      .min(1, "Minimo 1 dígito")
      .max(99999, "Máximo 99999 dígitos.")
      .optional(),
    resistenciaIsolamentoPxS: z.coerce
      .number()
      .min(1, "Minimo 1 dígito")
      .max(99999, "Máximo 99999 dígitos.")
      .optional(),
    resistenciaIsolamentoPxMassa: z.coerce
      .number()
      .min(1, "Minimo 1 dígito")
      .max(99999, "Máximo 99999 dígitos.")
      .optional(),
    resistenciaIsolamentoSxMassa: z.coerce
      .number()
      .min(1, "Minimo 1 dígito")
      .max(99999, "Máximo 99999 dígitos.")
      .optional(),
    observacao: z.string().optional(),
  })
  .strict();
const disjuntorSchema = z
  .object({
    resistenciaContatoDisjuntorFechadoA: z.coerce
      .number()
      .min(1, "Minimo 1 dígito")
      .max(4, "Máximo 4 dígitos.")
      .optional(),
    resistenciaContatoDisjuntorFechadoB: z.coerce
      .number()
      .min(1, "Minimo 1 dígito")
      .max(4, "Máximo 4 dígitos.")
      .optional(),
    resistenciaContatoDisjuntorFechadoC: z.coerce
      .number()
      .min(1, "Minimo 1 dígito")
      .max(4, "Máximo 4 dígitos.")
      .optional(),

    resistenciaContatoDisjuntorAbertoA: z.coerce
      .number()
      .min(1, "Minimo 1 dígito")
      .max(4, "Máximo 4 dígitos.")
      .optional(),
    resistenciaContatoDisjuntorAbertoB: z.coerce
      .number()
      .min(1, "Minimo 1 dígito")
      .max(4, "Máximo 4 dígitos.")
      .optional(),
    resistenciaContatoDisjuntorAbertoC: z.coerce
      .number()
      .min(1, "Minimo 1 dígito")
      .max(4, "Máximo 4 dígitos.")
      .optional(),

    resistenciaIsolamentoAxMassa: z.coerce
      .number()
      .min(1, "Minimo 1 dígito")
      .max(4, "Máximo 4 dígitos.")
      .optional(),
    resistenciaIsolamentoBxMassa: z.coerce
      .number()
      .min(1, "Minimo 1 dígito")
      .max(4, "Máximo 4 dígitos.")
      .optional(),
    resistenciaIsolamentoCxMassa: z.coerce
      .number()
      .min(1, "Minimo 1 dígito")
      .max(4, "Máximo 4 dígitos.")
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

    observacao: z
      .string()
      .min(1, "Campo obrigatório")
      .max(100, "Resuma em no máximo 100 caracteres.")
      .optional(),
  })
  .strict();
// Feito
const malhaAterramentoSchema = z
  .object({
    avalicacao: z.enum(["CONFORME", "NAO_CONFORME"]).optional(),
    valorResistencia: z
      .number()
      .min(1, "Minimo 1 dígito")
      .max(4, "Máximo 4 dígitos.")
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
    observacao: z
      .string()
      .min(1, "Campo obrigatório")
      .max(100, "Resuma em no máximo 100 caracteres.")
      .optional(),
  })
  .strict();
// Feito
const resistorAterramentoSchema = z
  .object({
    resistenciaNominal: z
      .number()
      .min(1, "Minimo 1 dígito")
      .max(50, "Máximo 50 dígitos.")
      .optional(),
    resistenciaOhmicaMedida: z
      .number()
      .min(1, "Minimo 1 dígito")
      .max(50, "Máximo 50 dígitos.")
      .optional(),
    resistenciaIsolamento: z
      .number()
      .min(1, "Minimo 1 dígito")
      .max(10000, "Máximo 10000 dígitos.")
      .optional(),
    observacao: z
      .string()
      .min(1, "Campo obrigatório")
      .max(100, "Resuma em no máximo 100 caracteres.")
      .optional(),
  })
  .strict();
// Feito
const chaveSeccionadoraSchema = z
  .object({
    correnteAplicada: z
      .number()
      .min(1, "Minimo 1 dígito")
      .max(4, "Máximo 4 dígitos.")
      .optional(),
    tensaoEnsaio: z
      .number()
      .min(1, "Minimo 1 dígito")
      .max(4, "Máximo 4 dígitos.")
      .optional(),
    valorReferencia1: z
      .number()
      .min(1, "Minimo 1 dígito")
      .max(4, "Máximo 4 dígitos.")
      .optional(),
    valorReferencia2: z
      .number()
      .min(1, "Minimo 1 dígito")
      .max(4, "Máximo 4 dígitos.")
      .optional(),
    tempo: z
      .number()
      .min(1, "Minimo 1 dígito")
      .max(4, "Máximo 4 dígitos.")
      .optional(),
    resistenciaContatoA: z
      .number()
      .min(1, "Minimo 1 dígito")
      .max(4, "Máximo 4 dígitos.")
      .optional(),
    resistenciaContatoB: z
      .number()
      .min(1, "Minimo 1 dígito")
      .max(4, "Máximo 4 dígitos.")
      .optional(),
    resistenciaContatoC: z
      .number()
      .min(1, "Minimo 1 dígito")
      .max(4, "Máximo 4 dígitos.")
      .optional(),
    resistenciaIsolamentoA: z
      .number()
      .min(1, "Minimo 1 dígito")
      .max(4, "Máximo 4 dígitos.")
      .optional(),
    resistenciaIsolamentoB: z
      .number()
      .min(1, "Minimo 1 dígito")
      .max(4, "Máximo 4 dígitos.")
      .optional(),
    resistenciaIsolamentoC: z
      .number()
      .min(1, "Minimo 1 dígito")
      .max(4, "Máximo 4 dígitos.")
      .optional(),
    observacao: z
      .string()
      .min(1, "Campo obrigatório")
      .max(100, "Resuma em no máximo 100 caracteres.")
      .optional(),
  })
  .strict();
// Fazendo
const caboMuflaSchema = z.object({
  tensaoEnsaio: z
    .number()
    .min(1, "Minimo 1 dígito")
    .max(4, "Máximo 4 dígitos.")
    .optional(),
  valorReferencia: z
    .number()
    .min(1, "Minimo 1 dígito")
    .max(4, "Máximo 4 dígitos.")
    .optional(),
  tempo: z
    .number()
    .min(1, "Minimo 1 dígito")
    .max(2, "Máximo 2 dígitos.")
    .optional(),
  resistenciaIsolamentoX0xMassa: z
    .number()
    .min(1, "Minimo 1 dígito")
    .max(4, "Máximo 4 dígitos.")
    .optional(),
  resistenciaIsolamentoX11xMassa: z
    .number()
    .min(1, "Minimo 1 dígito")
    .max(4, "Máximo 4 dígitos.")
    .optional(),
  resistenciaIsolamentoX12xMassa: z
    .number()
    .min(1, "Minimo 1 dígito")
    .max(4, "Máximo 4 dígitos.")
    .optional(),
  resistenciaIsolamentoX21xMassa: z
    .number()
    .min(1, "Minimo 1 dígito")
    .max(4, "Máximo 4 dígitos.")
    .optional(),
  resistenciaIsolamentoX22xMassa: z
    .number()
    .min(1, "Minimo 1 dígito")
    .max(4, "Máximo 4 dígitos.")
    .optional(),
  resistenciaIsolamentoX31xMassa: z
    .number()
    .min(1, "Minimo 1 dígito")
    .max(4, "Máximo 4 dígitos.")
    .optional(),
  resistenciaIsolamentoX32xMassa: z
    .number()
    .min(1, "Minimo 1 dígito")
    .max(4, "Máximo 4 dígitos.")
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

  observacao: z
    .string()
    .min(1, "Campo obrigatório")
    .max(100, "Resuma em no máximo 100 caracteres.")
    .optional(),
});
// Feito
const fpTrafoSchema = z
  .object({
    correnteN1: z
      .number()
      .min(1, "Minimo 1 dígito")
      .max(5, "Máximo 5 dígitos.")
      .optional(),
    correnteN2: z
      .number()
      .min(1, "Minimo 1 dígito")
      .max(5, "Máximo 5 dígitos.")
      .optional(),
    correnteN3: z
      .number()
      .min(1, "Minimo 1 dígito")
      .max(5, "Máximo 5 dígitos.")
      .optional(),
    correnteN5: z
      .number()
      .min(1, "Minimo 1 dígito")
      .max(5, "Máximo 5 dígitos.")
      .optional(),
    correnteN5: z
      .number()
      .min(1, "Minimo 1 dígito")
      .max(5, "Máximo 5 dígitos.")
      .optional(),
    correnteN6: z
      .number()
      .min(1, "Minimo 1 dígito")
      .max(5, "Máximo 5 dígitos.")
      .optional(),

    wattsN1: z
      .number()
      .min(1, "Minimo 1 dígito")
      .max(4, "Máximo 4 dígitos.")
      .optional(),
    wattsN2: z
      .number()
      .min(1, "Minimo 1 dígito")
      .max(4, "Máximo 4 dígitos.")
      .optional(),
    wattsN3: z
      .number()
      .min(1, "Minimo 1 dígito")
      .max(4, "Máximo 4 dígitos.")
      .optional(),
    wattsN4: z
      .number()
      .min(1, "Minimo 1 dígito")
      .max(4, "Máximo 4 dígitos.")
      .optional(),
    wattsN5: z
      .number()
      .min(1, "Minimo 1 dígito")
      .max(4, "Máximo 4 dígitos.")
      .optional(),
    wattsN6: z
      .number()
      .min(1, "Minimo 1 dígito")
      .max(4, "Máximo 4 dígitos.")
      .optional(),

    fatorPotenciaN1: z
      .number()
      .min(1, "Minimo 1 dígito")
      .max(4, "Máximo 4 dígitos.")
      .optional(),
    fatorPotenciaN2: z
      .number()
      .min(1, "Minimo 1 dígito")
      .max(4, "Máximo 4 dígitos.")
      .optional(),
    fatorPotenciaN3: z
      .number()
      .min(1, "Minimo 1 dígito")
      .max(4, "Máximo 4 dígitos.")
      .optional(),
    fatorPotenciaN4: z
      .number()
      .min(1, "Minimo 1 dígito")
      .max(4, "Máximo 4 dígitos.")
      .optional(),
    fatorPotenciaN5: z
      .number()
      .min(1, "Minimo 1 dígito")
      .max(4, "Máximo 4 dígitos.")
      .optional(),
    fatorPotenciaN6: z
      .number()
      .min(1, "Minimo 1 dígito")
      .max(4, "Máximo 4 dígitos.")
      .optional(),

    capacitanciaN1: z
      .number()
      .min(1, "Minimo 1 dígito")
      .max(4, "Máximo 4 dígitos.")
      .optional(),
    capacitanciaN2: z
      .number()
      .min(1, "Minimo 1 dígito")
      .max(4, "Máximo 4 dígitos.")
      .optional(),
    capacitanciaN3: z
      .number()
      .min(1, "Minimo 1 dígito")
      .max(4, "Máximo 4 dígitos.")
      .optional(),
    capacitanciaN4: z
      .number()
      .min(1, "Minimo 1 dígito")
      .max(4, "Máximo 4 dígitos.")
      .optional(),
    capacitanciaN5: z
      .number()
      .min(1, "Minimo 1 dígito")
      .max(4, "Máximo 4 dígitos.")
      .optional(),
    capacitanciaN6: z
      .number()
      .min(1, "Minimo 1 dígito")
      .max(4, "Máximo 4 dígitos.")
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
  TRAFO_POTENCIA: trafoPotenciaSchema,
  TRAFO_CORRENTE: trafoCorrenteSchema,
  DISJUNTOR: disjuntorSchema,
  RESISTOR: resistorAterramentoSchema,
  CHAVE_SECCIONADORA: chaveSeccionadoraSchema,
  MALHA_ATERRAMENTO: malhaAterramentoSchema,
  MEDICAO_CABO_MUFLA: caboMuflaSchema,
  FP_TRAFO: fpTrafoSchema,
  FP_BUCHA: tpBuchaSchema,
  CORRENTE_EXCITACAO: correnteExcitacao,
};