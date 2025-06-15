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
