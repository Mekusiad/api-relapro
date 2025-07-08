import { z } from "zod";

export const loginSchema = z.object({
  usuario: z.coerce.string().min(1, "Nome de usuário é obrigatório."),
  senha: z.coerce.string().min(5, "Senha é obrigatória."),
});

export const homeInfoSchema = z
  .object({
    funcionarioMatricula: z.coerce
      .string()
      .min(1, "Obrigatório enviar matrícula.")
      .max(100, "Máximo de 100 caracteres."),
  })
  .strict();

export const registrarFuncionarioSchema = z
  .object({
    nome: z.coerce
      .string()
      .min(3, "Nome é obrigatório e deve ter pelo menos 3 caracteres"),
    // usuario: z.coerce.string().min(3, "Usuário é obrigatório"),
    matricula: z.coerce
      .string()
      .min(1, "Obrigatório informar matrícula.")
      .max(5000, "Toma."),
    cargo: z.coerce.string().min(2, "Cargo é obrigatório"),
    // admissao: z.coerce.string().refine((val) => !isNaN(Date.parse(val)), {
    //   message: "Data de admissão inválida",
    // }),
    senha: z.coerce.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
    nivelAcesso: z.enum(["ADMIN", "SUPERVISOR", "TECNICO"]).optional(),
  })
  .strict();

export const atualizarDadosFuncionarioSchema = z
  .object({
    nome: z.coerce.string().min(3).optional(),
    usuario: z.coerce.string().min(3).optional(),
    matricula: z.coerce
      .string()
      .max(1000, "Máximo de 1000 caracteres.")
      .optional(),
    cargo: z.coerce.string().min(2).optional(),
    admissao: z.coerce
      .string()
      .refine((val) => !isNaN(Date.parse(val)), { message: "Data inválida" })
      .optional(),
    senha: z.coerce.string().min(6).optional(),
    nivelAcesso: z.enum(["ADMIN", "SUPERVISOR", "TECNICO"]).optional(),
  })
  .strict();

export const excluirFuncionarioSchema = z
  .object({
    matricula: z.preprocess(
      (val) => String(val).trim(),
      z.coerce.string().regex(/^\d+$/, "A matrícula deve conter apenas números")
    ),
    outraMatricula: z.preprocess(
      (val) => String(val).trim(),
      z.coerce.string().regex(/^\d+$/, "A matrícula deve conter apenas números")
    ),
  })
  .strict();

export const listarFuncionariosSchema = z
  .object({
    matricula: z.coerce.string().max(100, "Máximo de 100 caracteres"),
  })
  .strict();

export const listarOrdensDoFuncionarioSchema = {
  params: z
    .object({
      matricula: z.coerce.string().max(100, "Máximo de 100 caracteres"),
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
      numeroOs: z.coerce.string().optional(),
      cliente: z.coerce.string().optional(),
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
    cliente: z.coerce.string().min(1),
    nomeResponsavel: z.coerce.string().min(1),
    numeroOrcamento: z.coerce
      .string()
      .min(1, "Número do orçamento deve ter no mínimo 1 caractere.")
      .max(20, "Número do orçamento deve ter no máximo 20 caracteres.")
      .optional(),
    contato: z.coerce
      .string()
      .min(1, "Número de contato é obrigatório preencher."),
    email: z.coerce.string().email("Email é obrigatório"),
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
    localServico: z.coerce
      .string()
      .min(1, "Obrigatório informar o local do serviço."),
    descricaoInicial: z.coerce
      .string()
      .min(1, "Obrigatório informar a descrição inicial do serviço."),
    previsaoInicio: z.coerce.string().refine(
      (data) => {
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);
        const dataRecebida = new Date(data);
        return dataRecebida >= hoje;
      },
      {
        message: "A data de início não pode ser anterior ao dia de hoje.",
      }
    ),
    previsaoTermino: z.coerce.string().refine(
      (data) => {
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);
        const dataRecebida = new Date(data);
        return dataRecebida >= hoje;
      },
      {
        message: "A data de início não pode ser anterior ao dia de hoje.",
      }
    ),

    status: z.coerce
      .string()
      .optional()
      .refine(
        (val) => !val || ["ABERTA", "EM_ANDAMENTO", "FINALIZADA"].includes(val),
        {
          message: "Status inválido.",
        }
      ),
    conclusao: z.coerce
      .string()
      .max(1000, "Máximo de 1000 caracteres")
      .optional(),
    recomendacao: z.coerce
      .string()
      .max(1000, "Máximo de 1000 caracteres")
      .optional(),
    observacoes: z.coerce
      .string()
      .max(10000, "Máximo de 10000 caracteres")
      .optional(),
    subestacoes: z.array(z.any()),
    engenheiro: z.coerce
      .string()
      .max(100, "Máximo de 100 caracteres.")
      .nullable()
      .optional(),
    supervisor: z.coerce
      .string()
      .max(100, "Máximo de 100 caracteres.")
      .optional(),
    tecnico: z.coerce.string().max(100, "Máximo de 100 caracteres.").optional(),
  })
  .strict();

// Teste ---

export const criarOrdemComSubestacoesSchema = z
  .object({
    cliente: z.coerce.string().min(1, "Cliente é obrigatório"),
    nomeResponsavel: z.coerce
      .string()
      .min(1, "Nome do responsável é obrigatório"),
    numeroOrcamento: z.coerce
      .string()
      .min(1, "Número do orçamento deve ter no mínimo 1 caractere.")
      .max(20, "Número do orçamento deve ter no máximo 20 caracteres.")
      .optional(),
    contato: z.coerce
      .string()
      .min(1, "Número de contato é obrigatório preencher."),
    email: z.coerce.string().email("Email é obrigatório"),
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
    localServico: z.coerce
      .string()
      .min(1, "Obrigatório informar o local do serviço."),
    descricaoInicial: z.coerce
      .string()
      .min(1, "Obrigatório informar a descrição inicial do serviço."),
    previsaoInicio: z.coerce.string().refine((val) => !isNaN(Date.parse(val)), {
      message: "Data inválida",
    }),
    previsaoTermino: z.coerce
      .string()
      .refine((val) => !isNaN(Date.parse(val)), {
        message: "Data inválida",
      })
      .nullable()
      .optional(),
    status: z.coerce
      .string()
      .optional()
      .refine(
        (val) =>
          !val ||
          ["ABERTA", "EM_ANDAMENTO", "AGUARDANDO_PECAS", "FINALIZADA"].includes(
            val
          ),
        {
          message: "Status inválido.",
        }
      ),
    observacoes: z.coerce
      .string()
      .max(10000, "Máximo de 10000 caracteres")
      .optional(),

    subestacoes: z
      .array(
        z.object({
          nome: z.coerce.string().min(1, "Nome da subestação é obrigatório"),
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
                  "PARARAIO",
                  "CABOMUFLA",
                ]),
                numeroSerie: z.coerce.string().optional().nullable(),
                quantidade: z.number().int().positive().optional(),
              })
            )
            .optional(),
        })
      )
      .min(1, "Deve conter ao menos uma subestação"),
    engenheiro: z.coerce
      .string()
      .max(100, "Máximo de 100 caracteres.")
      .nullable()
      .optional(),
    supervisor: z.coerce
      .string()
      .max(100, "Máximo de 100 caracteres.")
      .optional(),
    tecnico: z
      .array(z.coerce.string().max(100, "Máximo de 100 caracteres."))
      .optional(),
    foto: z
      .array(
        z.object({
          descricao: z.string().max(100, "Máximo de 100 caracteres."),
          url: z.string().url("URL inválida."),
          cloudinaryId: z.string().max(100, "Máximo de 100 caracteres."),
        })
      )
      .optional()
      .nullable(),
  })
  .strict();

export const atualizarOrdemSchema = z.object({
  params: z
    .object({
      matricula: z.coerce.string().max(500, "Máximo de 500 caracteres."),
      numeroOs: z.coerce.string().max(500, "Máximo de 500 caracteres."),
    })
    .strict(),
  body: z
    .object({
      cliente: z.coerce
        .string()
        .max(100, "Máximo de 100 caracteres.")
        .optional(),
      nomeResponsavel: z
        .string()
        .max(100, "Máximo de 100 caracteres.")
        .optional(),
      localServico: z.coerce
        .string()
        .max(100, "Máximo de 100 caracteres.")
        .optional(),
      email: z.coerce.string().email("E-mail inválido").optional(),
      contato: z.coerce
        .string()
        .max(100, "Máximo de 100 caracteres.")
        .optional(),
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
      previsaoTermino: z.coerce
        .date({ message: "Data de término inválida" })
        .nullable()
        .optional(),

      status: z
        .enum(["ABERTA", "EM_ANDAMENTO", "AGUARDANDO_PECAS", "FINALIZADA"])
        .optional(),
      descricaoInicial: z
        .string()
        .max(100, "Descrição é obrigatória")
        .optional(),
      tecnico: z
        .array(z.coerce.string().max(100, "Matrícula obrigatória"))
        .nonempty("Ao menos um técnico é necessário")
        .optional(),
      supervisor: z
        .string()
        .max(100, "Matrícula do supervisor obrigatória")
        .optional(),
      engenheiro: z.coerce
        .string()
        .max(100, "Matrícula no máximo de 100 caracteres.")
        .transform((val) => (val === "" ? null : val))
        .nullable()
        .optional(),
      observacoes: z.coerce
        .string()
        .max(1000, "Máximo de 1000 caracteres.")
        .optional(),
      subestacoes: z
        .array(
          z.object({
            id: z.union([z.number(), z.coerce.string()]), // Pode vir como número ou string temporária
            nome: z.coerce
              .string()
              .max(100, "Nome da subestação é obrigatório"),
            observacoesTecnicasSubestacao: z.coerce.string().optional(),
            componentes: z.array(
              z.object({
                nomeEquipamento: z
                  .string()
                  .max(100, "Nome do equipamento obrigatório"),
                tipo: z.coerce
                  .string()
                  .max(100, "Tipo de equipamento obrigatório"),
                quantidade: z
                  .number()
                  .int()
                  .max(100, "Quantidade deve ser maior que 0"),
                numeroSerie: z.coerce.string(),
                fabricante: z.coerce.string(),
              })
            ),
          })
        )
        .nonempty("Deve haver ao menos uma subestação")
        .optional(),
      foto: z
        .array(
          z.object({
            descricao: z.string().max(100, "Máximo de 100 caracteres."),
            url: z.string().url("URL inválida."),
            cloudinaryId: z.string().max(100, "Máximo de 100 caracteres."),
          })
        )
        .optional()
        .nullable(),
    })
    .strict(),
  query: z.any().optional(),
});

export const excluirOsSchema = z
  .object({
    matricula: z.coerce.string().regex(/^\d+$/).transform(Number),
    numeroOs: z.coerce.string().min(1),
  })
  .strict();

export const adicionarTecnicoSchema = z
  .object({
    numeroOs: z.coerce.string().min(1),
    tecnicoMatricula: z.array(
      z.preprocess(
        (val) => String(val).trim(),
        z.coerce.string().regex(/^\d+$/, "Matrícula inválida")
      )
    ),
  })
  .strict();

export const removerTecnicoSchema = z
  .object({
    numeroOs: z.coerce.string().min(1),
    tecnicoMatricula: z.array(
      z.preprocess(
        (val) => String(val).trim(),
        z.coerce.string().regex(/^\d+$/, "Matrícula inválida")
      )
    ),
  })
  .strict();

export const trocarSupervisorSchema = z
  .object({
    numeroOs: z.coerce.string().min(1, "Número da OS é obrigatório."),
    supervisorMatricula: z.coerce.number({
      required_error: "A matrícula do supervisor é obrigatória.",
      invalid_type_error: "A matrícula deve ser um número.",
    }),
  })
  .strict();

export const atualizaStatusSchema = z
  .object({
    numeroOs: z.coerce.string().min(1, "Número da OS é obrigatório."),
    status: z.enum(["ABERTA", "EM_ANDAMENTO", "FINALIZADA", "CANCELADA"], {
      required_error: "Status é obrigatório.",
      invalid_type_error: "Status inválido.",
    }),
  })
  .strict();

export const adicionarSubestacaoSchema = z.object({
  params: z.object({
    matricula: z.coerce.string().regex(/^\d+$/),
    numeroOs: z.coerce.string().min(1),
  }),
  body: z.object({
    nome: z.coerce.string().min(1, "O nome da subestação é obrigatório."),
    componentes: z.array(z.any()),
  }),
});

export const listarSubestacaoSchema = z
  .object({
    matricula: z.coerce.string().min(1, "Obrigatório informar matrícula."),
    numeroOs: z.coerce.string().min(1, "Número da OS é obrigatório."),
  })
  .strict();

export const removerSubestacaoSchema = z
  .object({
    matricula: z.coerce
      .string()
      .min(1, "Obrigatório informar matrícula.")
      .transform(Number),
    numeroOs: z.coerce.string().min(1, "Número da OS é obrigatório."),
    subestacaoId: z.coerce
      .string()
      .regex(/^\d+$/, "Id da subestação deve conter apenas números.")
      .transform(Number),
  })
  .strict();

export const atualizarDadosSubestacaoSchema = z
  .object({
    matricula: z.coerce
      .string()
      .min(1, "Obrigatório informar matrícula.")
      .transform(Number),
    numeroOs: z.coerce.string().min(1, "Número da OS é obrigatório."),
    subestacaoId: z.coerce
      .string()
      .regex(/^\d+$/, "Id da subestação deve conter apenas números.")
      .transform(Number),
  })
  .strict();

export const detalharOrdemFuncionarioSchema = z
  .object({
    matricula: z.coerce.string().min(1, "Obrigatório informar matrícula."),
    numeroOs: z.coerce.string().min(1, "Número da OS é obrigatório."),
  })
  .strict();

export const listarComponentesDaSubestacaoSchema = z
  .object({
    matricula: z.coerce.string().min(1, "Obrigatório informar matrícula."),
    numeroOs: z.coerce.string().min(1, "Número da OS é obrigatório."),
    subestacaoId: z.coerce
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
      numeroOs: z.coerce.string(),
      subestacaoId: z.coerce.number(),
    })
    .strict(),
  body: z
    .object({
      nomeEquipamento: z.coerce.string().min(1, "Nome é obrigatório"),
      numeroSerie: z.coerce.string().min(1, "Número de série é obrigatório"),
      tipo: z.coerce.string().min(1, "Tipo é obrigatório"),
      fabricante: z.coerce.string().min(1, "Tipo é obrigatório"),
      quantidade: z.number().int().positive().optional(),
    })
    .strict(),
  query: z.object({}).optional(),
});

export const atualizarComponenteSchema = z.object({
  params: z
    .object({
      matricula: z.coerce.string().max(100, "Máximo de 100 caracteres."),
      numeroOs: z.coerce.string().max(100, "Máximo de 100 caracteres."),
      subestacaoId: z.coerce.number(),
      componenteId: z.coerce.number(),
    })
    .strict(),
  body: z
    .object({
      nomeEquipamento: z.coerce.string().optional(),
      quantidade: z.number().int().positive().optional(),
      cliente: z.coerce.string().optional(),
      tag: z.coerce.string().optional(),
      identificacao: z.coerce.string().optional(),
      localizacao: z.coerce.string().optional(),
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
      modelo: z.coerce.string().optional(),
      fabricante: z.coerce.string().optional(),
      numeroSerie: z.coerce.string().optional(),
      meioIsolante: z.coerce.string().optional(),
      anoFabricacao: z.coerce.number().int().optional(),
      massaTotal: z.coerce.number().optional(),
      potencia: z.coerce.string().optional(),
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
      tensaoBt: z.coerce
        .string()
        .max(100, "Máximo de 100 caractere")
        .optional(),
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
      exatidao: z.coerce.string().optional(),
      frequencia: z.coerce.number().optional(),
      circuito: z.coerce
        .string()
        .max(100, "Máximo de 100 caracteres.")
        .optional(),
      curtoCircuito: z.coerce
        .number()
        .max(100, "Máximo de 100 caracteres.")
        .optional(),
      tipoPressao: z.coerce.string().optional(),
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
      numeroOs: z.coerce.string(),
      subestacaoId: z.coerce.number(),
      componenteId: z.coerce.number(),
    })
    .strict(),
});

export const buscarFuncionarioPorMatriculaSchema = z.object({
  matricula: z.coerce.string().max(100, "Máximo de 100 caracteres."),
  outraMatricula: z.coerce.string().max(100, "Máximo de 100 caracteres."),
});

export const cadastrarEquipamentoSchema = z.object({
  body: z
    .object({
      nome: z.coerce.string().min(1, "Nome do equipamento é obrigatório."),
      descricao: z.coerce
        .string()
        .min(1, "Descrição do equipamento é obrigatório."),
      modelo: z.coerce.string().min(1, "Modelo é obrigatório"),
      numeroSerie: z.coerce.string().min(1, "O número de série é obrigatório."),
      foto: z.coerce.string().url("URL inválida").optional(),
    })
    .strict(),
});

export const atualizarEquipamentoSchema = z.object({
  body: z
    .object({
      nome: z.coerce.string().optional(),
      descricao: z.coerce.string().optional(),
      modelo: z.coerce.string().optional(),
      numeroSerie: z.coerce.string().optional(),
      foto: z.coerce.string().url("URL inválida").optional(),
    })
    .strict(),
  params: z
    .object({
      matricula: z.coerce.string().min(1, "Obrigatório informar matrícula."),
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
      matricula: z.coerce.string().min(1, "Obrigatório informar matrícula."),
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
      matricula: z.coerce.string().min(1, "Obrigatório informar matrícula."),
    })
    .strict(),
});

//  Schema para excluir fotos
export const excluirFotoDaOrdemSchema = z
  .object({
    numeroOs: z.preprocess(
      (val) => String(val).trim(),
      z.coerce
        .string()
        .regex(/^\d+$/, "A ordem de serviço deve conter apenas números")
    ),
    matricula: z.preprocess(
      (val) => String(val).trim(),
      z.coerce.string().regex(/^\d+$/, "A matrícula deve conter apenas números")
    ),
    fotoId: z.coerce.string(),
  })
  .strict();

export const excluirFotoDoEnsaioSchema = z
  .object({
    ensaioId: z.coerce.string().max(100, "Máximo de 100 caracteres"),
    fotoId: z.coerce.string().max(100, "Máximo de 100 caracteres"),
  })
  .strict();

// Schemas por tipo de ensaio
export const ensaioSchema = z
  .object({
    body: z
      .object({
        tipo: z.enum([
          "TRAFO_ALTA",
          "TRAFO_POTENCIA",
          "TRAFO_MEDIA",
          "TRAFO_CORRENTE",
          "DISJUNTOR_ALTA",
          "DISJUNTOR_MEDIA",
          "RESISTOR",
          "CHAVE_SECCIONADORA",
          "PARARAIO",
          "MALHA",
          "CABOMUFLA",
          "BUCHA",
          "OUTRO",
        ]),
        responsavel: z
          .string()
          .max(100, "Máximo de 100 caracteres.")
          .optional(),
        engenheiro: z.string().max(100, "Máximo de 100 caracteres.").optional(),
        equipamento: z.array(z.coerce.number()).optional(),
        fotos: z
          .array(
            z.object({
              descricao: z.string().max(100, "Máximo de 100 caracteres."),
              url: z.string().url("URL inválida."),
              cloudinaryId: z.string().max(100, "Máximo de 100 caracteres."),
            })
          )
          .optional()
          .nullable(),
        dados: z.any(),
      })
      .strict(),
    params: z.object({
      matricula: z.coerce.string().min(1, "É obrigatório informar matrícula."),
      numeroOs: z
        .string()
        .min(1, "OS deve possuir no mínimo 1 dígito.")
        .max(100, "OS deve possuir no máximo 100 caracteres."),
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
  tensaoTapAt: z.coerce
    .string()
    .max(100, "Máximo de 100 caracteres")
    .nullable()
    .optional(),
  tensaoTapBt: z.coerce
    .string()
    .max(100, "Máximo de 100 caracteres")
    .nullable()
    .optional(),
  relacaoCalculadaAtxBt: z.coerce
    .string()
    .max(100, "Máximo de 100 caracteres")
    .nullable()
    .optional(),
  relacaoMedida1: z.coerce
    .string()
    .max(100, "Máximo de 100 caracteres")
    .nullable()
    .optional(),
  relacaoMedida2: z.coerce
    .string()
    .max(100, "Máximo de 100 caracteres")
    .nullable()
    .optional(),
  relacaoMedida3: z.coerce
    .string()
    .max(100, "Máximo de 100 caracteres")
    .nullable()
    .optional(),
  resistenciaOhmicaEnrolamentoAt1: z.coerce
    .string()
    .max(100, "Máximo de 100 caracteres")
    .nullable()
    .optional(),
  resistenciaOhmicaEnrolamentoAt2: z.coerce
    .string()
    .max(100, "Máximo de 100 caracteres")
    .nullable()
    .optional(),
  resistenciaOhmicaEnrolamentoAt3: z.coerce
    .string()
    .max(100, "Máximo de 100 caracteres")
    .nullable()
    .optional(),
  resistenciaOhmicaEnrolamentoBt1: z.coerce
    .string()
    .max(100, "Máximo de 100 caracteres")
    .nullable()
    .optional(),
  resistenciaOhmicaEnrolamentoBt2: z.coerce
    .string()
    .max(100, "Máximo de 100 caracteres")
    .nullable()
    .optional(),
  resistenciaOhmicaEnrolamentoBt3: z.coerce
    .string()
    .max(100, "Máximo de 100 caracteres")
    .nullable()
    .optional(),
  tensaoEnsaio: z.coerce
    .string()
    .max(10, "Máximo de 10 caracteres")
    .nullable()
    .optional(),
  tempoEnsaio: z.coerce
    .string()
    .max(10, "Máximo de 10 caracteres")
    .nullable()
    .optional(),
  resistenciaIsolamentoAtxBt: z.coerce
    .string()
    .max(100, "Máximo de 100 caracteres")
    .nullable()
    .optional(),
  resistenciaIsolamentoAtxMassa: z.coerce
    .string()
    .max(100, "Máximo de 100 caracteres")
    .nullable()
    .optional(),
  resistenciaIsolamentoBtxMassa: z.coerce
    .string()
    .max(100, "Máximo de 100 caracteres")
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
  correnteN1: z.coerce
    .string()
    .max(100, "Máximo de 100 caracteres")
    .nullable()
    .optional(),
  correnteN2: z.coerce
    .string()
    .max(100, "Máximo de 100 caracteres")
    .nullable()
    .optional(),
  correnteN3: z.coerce
    .string()
    .max(100, "Máximo de 100 caracteres")
    .nullable()
    .optional(),
  correnteN4: z.coerce
    .string()
    .max(100, "Máximo de 100 caracteres")
    .nullable()
    .optional(),
  correnteN5: z.coerce
    .string()
    .max(100, "Máximo de 100 caracteres")
    .nullable()
    .optional(),
  correnteN6: z.coerce
    .string()
    .max(100, "Máximo de 100 caracteres")
    .nullable()
    .optional(),
  wattsN1: z.coerce
    .string()
    .max(100, "Máximo de 100 caracteres")
    .nullable()
    .optional(),
  wattsN2: z.coerce
    .string()
    .max(100, "Máximo de 100 caracteres")
    .nullable()
    .optional(),
  wattsN3: z.coerce
    .string()
    .max(100, "Máximo de 100 caracteres")
    .nullable()
    .optional(),
  wattsN4: z.coerce
    .string()
    .max(100, "Máximo de 100 caracteres")
    .nullable()
    .optional(),
  wattsN5: z.coerce
    .string()
    .max(100, "Máximo de 100 caracteres")
    .nullable()
    .optional(),
  wattsN6: z.coerce
    .string()
    .max(100, "Máximo de 100 caracteres")
    .nullable()
    .optional(),
  fatorPotenciaN1: z.coerce
    .string()
    .max(100, "Máximo de 100 caracteres")
    .nullable()
    .optional(),
  fatorPotenciaN2: z.coerce
    .string()
    .max(100, "Máximo de 100 caracteres")
    .nullable()
    .optional(),
  fatorPotenciaN3: z.coerce
    .string()
    .max(100, "Máximo de 100 caracteres")
    .nullable()
    .optional(),
  fatorPotenciaN4: z.coerce
    .string()
    .max(100, "Máximo de 100 caracteres")
    .nullable()
    .optional(),
  fatorPotenciaN5: z.coerce
    .string()
    .max(100, "Máximo de 100 caracteres")
    .nullable()
    .optional(),
  fatorPotenciaN6: z.coerce
    .string()
    .max(100, "Máximo de 100 caracteres")
    .nullable()
    .optional(),
  capacitanciaN1: z.coerce
    .string()
    .max(100, "Máximo de 100 caracteres")
    .nullable()
    .optional(),
  capacitanciaN2: z.coerce
    .string()
    .max(100, "Máximo de 100 caracteres")
    .nullable()
    .optional(),
  capacitanciaN3: z.coerce
    .string()
    .max(100, "Máximo de 100 caracteres")
    .nullable()
    .optional(),
  capacitanciaN4: z.coerce
    .string()
    .max(100, "Máximo de 100 caracteres")
    .nullable()
    .optional(),
  capacitanciaN5: z.coerce
    .string()
    .max(100, "Máximo de 100 caracteres")
    .nullable()
    .optional(),
  capacitanciaN6: z.coerce
    .string()
    .max(100, "Máximo de 100 caracteres")
    .nullable()
    .optional(),
  numeroSerieBucha1: z.coerce
    .string()
    .max(100, "Máximo de 100 caracteres")
    .nullable()
    .optional(),
  numeroSerieBucha2: z.coerce
    .string()
    .max(100, "Máximo de 100 caracteres")
    .nullable()
    .optional(),
  numeroSerieBucha3: z.coerce
    .string()
    .max(100, "Máximo de 100 caracteres")
    .nullable()
    .optional(),
  correnteBucha1: z.coerce
    .string()
    .max(100, "Máximo de 100 caracteres")
    .nullable()
    .optional(),
  correnteBucha2: z.coerce
    .string()
    .max(100, "Máximo de 100 caracteres")
    .nullable()
    .optional(),
  correnteBucha3: z.coerce
    .string()
    .max(100, "Máximo de 100 caracteres")
    .nullable()
    .optional(),
  wattsBucha1: z.coerce
    .string()
    .max(100, "Máximo de 100 caracteres")
    .nullable()
    .optional(),
  wattsBucha2: z.coerce
    .string()
    .max(100, "Máximo de 100 caracteres")
    .nullable()
    .optional(),
  wattsBucha3: z.coerce
    .string()
    .max(100, "Máximo de 100 caracteres")
    .nullable()
    .optional(),
  fatorPotenciaCorrente: z.coerce
    .string()
    .max(100, "Máximo de 100 caracteres")
    .nullable()
    .optional(),
  fatorPotenciaBucha1: z.coerce
    .string()
    .max(100, "Máximo de 100 caracteres")
    .nullable()
    .optional(),
  fatorPotenciaBucha2: z.coerce
    .string()
    .max(100, "Máximo de 100 caracteres")
    .nullable()
    .optional(),
  fatorPotenciaBucha3: z.coerce
    .string()
    .max(100, "Máximo de 100 caracteres")
    .nullable()
    .optional(),
  capacitanciaBucha1: z.coerce
    .string()
    .max(100, "Máximo de 100 caracteres")
    .nullable()
    .optional(),
  capacitanciaBucha2: z.coerce
    .string()
    .max(100, "Máximo de 100 caracteres")
    .nullable()
    .optional(),
  capacitanciaBucha3: z.coerce
    .string()
    .max(100, "Máximo de 100 caracteres")
    .nullable()
    .optional(),
  correnteH1H3: z.coerce
    .string()
    .max(100, "Máximo de 100 caracteres")
    .nullable()
    .optional(),
  correnteH2H1: z.coerce
    .string()
    .max(100, "Máximo de 100 caracteres")
    .nullable()
    .optional(),
  correnteH3H2: z.coerce
    .string()
    .max(100, "Máximo de 100 caracteres")
    .nullable()
    .optional(),
  avaliacao: z.enum(["CONFORME", "NAO_CONFORME"]).optional(),
  descricaoAvaliacao: z.coerce
    .string()
    .max(500, "Máximo de 100 caracteres")
    .optional(),
  observacao: z.coerce
    .string()
    .max(1000, "Máximo de 1000 caracteres")
    .optional(),
  protecao1: z.enum(["CONFORME", "NAO_CONFORME", "N/A"]).optional(),
  protecao2: z.enum(["CONFORME", "NAO_CONFORME", "N/A"]).optional(),
  protecao3: z.enum(["CONFORME", "NAO_CONFORME", "N/A"]).optional(),
  protecao4: z.enum(["CONFORME", "NAO_CONFORME", "N/A"]).optional(),
  protecao5: z.enum(["CONFORME", "NAO_CONFORME", "N/A"]).optional(),
  protecao6: z.enum(["CONFORME", "NAO_CONFORME", "N/A"]).optional(),
});

const trafoMediaSchema = z.object({
  tapComutadorAt: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z.enum(["1", "2", "3", "4", "5", "-"]).default("-").optional()
  ),
  tapComutadorBt: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z.enum(["1", "2", "3", "4", "5", "-"]).default("-").optional()
  ),
  tensaoTapAt: z.coerce
    .string()
    .max(100, "Máximo de 100 caracteres")
    .nullable()
    .optional(),
  tensaoTapBt: z.coerce
    .string()
    .max(100, "Máximo de 100 caracteres")
    .nullable()
    .optional(),
  relacaoCalculadaAtxBt: z.coerce
    .string()
    .max(100, "Máximo de 100 caracteres")
    .nullable()
    .optional(),
  relacaoMedida1: z.coerce
    .string()
    .max(100, "Máximo de 100 caracteres")
    .nullable()
    .optional(),
  relacaoMedida2: z.coerce
    .string()
    .max(100, "Máximo de 100 caracteres")
    .nullable()
    .optional(),
  relacaoMedida3: z.coerce
    .string()
    .max(100, "Máximo de 100 caracteres")
    .nullable()
    .optional(),
  resistenciaOhmicaEnrolamentoAt1: z.coerce
    .string()
    .max(100, "Máximo de 100 caracteres")
    .nullable()
    .optional(),
  resistenciaOhmicaEnrolamentoAt2: z.coerce
    .string()
    .max(100, "Máximo de 100 caracteres")
    .nullable()
    .optional(),
  resistenciaOhmicaEnrolamentoAt3: z.coerce
    .string()
    .max(100, "Máximo de 100 caracteres")
    .nullable()
    .optional(),
  resistenciaOhmicaEnrolamentoBt1: z.coerce
    .string()
    .max(100, "Máximo de 100 caracteres")
    .nullable()
    .optional(),
  resistenciaOhmicaEnrolamentoBt2: z.coerce
    .string()
    .max(100, "Máximo de 100 caracteres")
    .nullable()
    .optional(),
  resistenciaOhmicaEnrolamentoBt3: z.coerce
    .string()
    .max(100, "Máximo de 100 caracteres")
    .nullable()
    .optional(),
  tensaoEnsaio: z.coerce
    .string()
    .max(10, "Máximo de 10 caracteres")
    .nullable()
    .optional(),
  tempoEnsaio: z.coerce
    .string()
    .max(10, "Máximo de 10 caracteres")
    .nullable()
    .optional(),
  resistenciaIsolamentoAtxBt: z.coerce
    .string()
    .max(100, "Máximo de 100 caracteres")
    .nullable()
    .optional(),
  resistenciaIsolamentoAtxMassa: z.coerce
    .string()
    .max(100, "Máximo de 100 caracteres")
    .nullable()
    .optional(),
  resistenciaIsolamentoBtxMassa: z.coerce
    .string()
    .max(100, "Máximo de 100 caracteres")
    .nullable()
    .optional(),
  servico1: z.enum(["SIM", "NAO", "N/A"]).optional(),
  servico2: z.enum(["SIM", "NAO", "N/A"]).optional(),
  servico3: z.enum(["SIM", "NAO", "N/A"]).optional(),
  servico4: z.enum(["SIM", "NAO", "N/A"]).optional(),
  avaliacao: z.enum(["CONFORME", "NAO_CONFORME"]).optional(),
  descricaoAvaliacao: z.coerce
    .string()
    .max(500, "Máximo de 100 caracteres")
    .optional(),
  observacao: z.coerce
    .string()
    .max(1000, "Máximo de 1000 caracteres")
    .optional(),
});

const trafoAltaSchema = z
  .object({
    servicos: z
      .array(
        z.object({
          label: z.string(),
          valor: z.enum(["SIM", "NAO", "N/A"]),
        })
      )
      .optional(),

    relacaoTransformacao: z
      .array(
        z.object({
          tap_comutador_at: z.string().optional().nullable(),
          tap_comutador_bt: z.string().optional().nullable(),
          tensao_v_at: z.string().optional().nullable(),
          tensao_v_bt: z.string().optional().nullable(),
          rel_calc: z.string().optional().nullable(),
          rel_med_h1h3x1x0: z.string().optional().nullable(),
          rel_med_h2h1x2x0: z.string().optional().nullable(),
          rel_med_h3h2x3x0: z.string().optional().nullable(),
        })
      )
      .optional(),

    resOhmicaAT: z
      .array(
        z.object({
          tap_comutador: z.string().optional().nullable(),
          tensao_at: z.string().optional().nullable(),
          h1h3: z.string().optional().nullable(),
          h2h1: z.string().optional().nullable(),
          h3h2: z.string().optional().nullable(),
        })
      )
      .optional(),

    resOhmicaBT: z
      .array(
        z.object({
          tap_comutador: z.string().optional().nullable(),
          tensao_bt: z.string().optional().nullable(),
          x1x0: z.string().optional().nullable(),
          x2x0: z.string().optional().nullable(),
          x3x0: z.string().optional().nullable(),
        })
      )
      .optional(),

    resIsolamento: z
      .array(
        z.object({
          terminais: z.string().optional().nullable(),
          tensao_ensaio: z.string().optional().nullable(),
          val_medido: z.string().optional().nullable(),
          tempo_s: z.string().optional().nullable(),
        })
      )
      .optional(),

    fpTrafo: z
      .array(
        z.object({
          n: z.string().optional().nullable(),
          hv: z.string().optional().nullable(),
          lv_r: z.string().optional().nullable(),
          guard: z.string().optional().nullable(),
          ch_pos: z.string().optional().nullable(),
          ma: z.string().optional().nullable(),
          watts: z.string().optional().nullable(),
          fp_med: z.string().optional().nullable(),
          fp_corr: z.string().optional().nullable(),
          cap_med: z.string().optional().nullable(),
          cap_fab: z.string().optional().nullable(),
        })
      )
      .optional(),

    fpBuchas: z
      .array(
        z.object({
          n_serie: z.string().optional().nullable(),
          hv: z.string().optional().nullable(),
          lv_r: z.string().optional().nullable(),
          ch_pos: z.string().optional().nullable(),
          ma: z.string().optional().nullable(),
          watts: z.string().optional().nullable(),
          fp_med: z.string().optional().nullable(),
          fp_corr: z.string().optional().nullable(),
          cap_med: z.string().optional().nullable(),
          cap_fab: z.string().optional().nullable(),
        })
      )
      .optional(),

    correnteExcitacao: z
      .array(
        z.object({
          fase: z.string().optional().nullable(),
          tensao_kv: z.string().optional().nullable(),
          ma: z.string().optional().nullable(),
        })
      )
      .optional(),

    avaliacao: z.enum(["CONFORME", "NAO_CONFORME"]).optional(),
    descricaoAvaliacao: z.coerce.string().max(1000).optional(),
    observacao: z.coerce.string().max(1000).optional(),
  })
  .strict();

const trafoCorrenteSchema = z
  .object({
    correnteNominalAt: z.coerce
      .string()

      .max(100, "Máximo 100 caracteres.")
      .nullable()
      .optional(),
    correnteNominalBt: z.coerce
      .string()

      .max(100, "Máximo 100 caracteres.")
      .nullable()
      .optional(),
    correntePrimario: z.coerce
      .string()

      .max(100, "Máximo 100 caracteres.")
      .nullable()
      .optional(),
    correnteSecundario: z.coerce
      .string()

      .max(100, "Máximo 100 caracteres.")
      .nullable()
      .optional(),
    terminalMedicao: z.coerce
      .string()
      .max(100, "Máximo 100 caracteres.")
      .nullable()
      .optional(),
    relacaoCalculada: z
      .array(
        z.coerce
          .string()
          .max(100, "Máximo 100 caracteres.")
          .nullable()
          .optional()
      )
      .nullable()
      .optional(),
    relacaoMedida: z
      .array(
        z.coerce
          .string()
          .max(100, "Máximo 100 caracteres.")
          .nullable()
          .optional()
      )
      .nullable()
      .optional(),
    relacaoOhmica: z
      .array(
        z.coerce
          .string()
          .max(100, "Máximo 100 caracteres.")
          .nullable()
          .optional()
      )
      .nullable()
      .optional(),
    temperaturaEnsaio: z.coerce
      .string()

      .max(100, "Máximo 100 caracteres.")
      .nullable()
      .optional(),
    resistenciaIsolamentoPxS: z
      .array(
        z.coerce
          .string()
          .max(100, "Máximo 100 caracteres.")
          .nullable()
          .optional()
      )
      .nullable()
      .optional(),

    resistenciaIsolamentoPxMassa: z
      .array(
        z.coerce
          .string()
          .max(100, "Máximo 100 caracteres.")
          .nullable()
          .optional()
      )
      .nullable()
      .optional(),

    resistenciaIsolamentoSxMassa: z
      .array(
        z.coerce
          .string()
          .max(100, "Máximo 100 caracteres.")
          .nullable()
          .optional()
      )
      .nullable()
      .optional(),
    avaliacao: z.enum(["CONFORME", "NAO_CONFORME"]).optional(),
    descricaoAvaliacao: z.coerce
      .string()
      .max(500, "Máximo 500 caracteres.")
      .optional(),
    observacao: z.coerce
      .string()
      .max(1000, "Resuma em no máximo 1000 caracteres.")
      .optional(),
  })
  .strict();

const disjuntorSchema = z
  .object({
    correnteAplicada: z.coerce
      .string()
      .max(100, "Máximo 100 caracteres.")
      .nullable()
      .optional(),
    tensaoEnsaio: z.coerce
      .string()
      .max(100, "Máximo 100 caracteres.")
      .nullable()
      .optional(),
    tempoEnsaio: z.coerce
      .string()
      .max(100, "Máximo 100 caracteres.")
      .nullable()
      .optional(),
    correnteAplicada: z.coerce
      .string()

      .max(100, "Máximo 100 caracteres.")
      .nullable()
      .optional(),
    resistenciaContatoFechadoA: z.coerce
      .string()

      .max(100, "Máximo 100 caracteres.")
      .nullable()
      .optional(),
    resistenciaContatoFechadoB: z.coerce
      .string()

      .max(100, "Máximo 100 caracteres.")
      .nullable()
      .optional(),
    resistenciaContatoFechadoC: z.coerce
      .string()

      .max(100, "Máximo 100 caracteres.")
      .nullable()
      .optional(),

    resistenciaContatoAbertoA: z.coerce
      .string()

      .max(100, "Máximo 100 caracteres.")
      .nullable()
      .optional(),
    resistenciaContatoAbertoB: z.coerce
      .string()

      .max(100, "Máximo 100 caracteres.")
      .nullable()
      .optional(),
    resistenciaContatoAbertoC: z.coerce
      .string()

      .max(100, "Máximo 100 caracteres.")
      .nullable()
      .optional(),

    resistenciaIsolamentoAbertoA: z.coerce
      .string()

      .max(100, "Máximo 100 caracteres.")
      .nullable()
      .optional(),
    resistenciaIsolamentoAbertoB: z.coerce
      .string()

      .max(100, "Máximo 100 caracteres.")
      .nullable()
      .optional(),
    resistenciaIsolamentoAbertoC: z.coerce
      .string()

      .max(100, "Máximo 100 caracteres.")
      .nullable()
      .optional(),

    resistenciaIsolamentoAxMassa: z.coerce
      .string()

      .max(100, "Máximo 100 caracteres.")
      .nullable()
      .optional(),
    resistenciaIsolamentoBxMassa: z.coerce
      .string()

      .max(100, "Máximo 100 caracteres.")
      .nullable()
      .optional(),
    resistenciaIsolamentoCxMassa: z.coerce
      .string()
      .max(100, "Máximo 100 caracteres.")
      .nullable()
      .optional(),
    correntePoloAbertoA: z.coerce
      .string()

      .max(100, "Máximo 100 caracteres.")
      .nullable()
      .optional(),
    correntePoloAbertoB: z.coerce
      .string()

      .max(100, "Máximo 100 caracteres.")
      .nullable()
      .optional(),
    correntePoloAbertoC: z.coerce
      .string()

      .max(100, "Máximo 100 caracteres.")
      .nullable()
      .optional(),
    wattsPoloAbertoA: z.coerce
      .string()

      .max(100, "Máximo 100 caracteres.")
      .nullable()
      .optional(),
    wattsPoloAbertoB: z.coerce
      .string()

      .max(100, "Máximo 100 caracteres.")
      .nullable()
      .optional(),
    wattsPoloAbertoC: z.coerce
      .string()

      .max(100, "Máximo 100 caracteres.")
      .nullable()
      .optional(),
    fatorPotenciaPoloAbertoA: z.coerce
      .string()

      .max(100, "Máximo 100 caracteres.")
      .nullable()
      .optional(),
    fatorPotenciaPoloAbertoB: z.coerce
      .string()

      .max(100, "Máximo 100 caracteres.")
      .nullable()
      .optional(),
    fatorPotenciaPoloAbertoC: z.coerce
      .string()

      .max(100, "Máximo 100 caracteres.")
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
    correntePoloFechadoA: z.coerce
      .string()

      .max(100, "Máximo 100 caracteres.")
      .nullable()
      .optional(),
    correntePoloFechadoB: z.coerce
      .string()

      .max(100, "Máximo 100 caracteres.")
      .nullable()
      .optional(),
    correntePoloFechadoC: z.coerce
      .string()

      .max(100, "Máximo 100 caracteres.")
      .nullable()
      .optional(),
    wattsPoloFechadoA: z.coerce
      .string()

      .max(100, "Máximo 100 caracteres.")
      .nullable()
      .optional(),
    wattsPoloFechadoB: z.coerce
      .string()

      .max(100, "Máximo 100 caracteres.")
      .nullable()
      .optional(),
    wattsPoloFechadoC: z.coerce
      .string()

      .max(100, "Máximo 100 caracteres.")
      .nullable()
      .optional(),
    fatorPotenciaPoloFechadoA: z.coerce
      .string()

      .max(100, "Máximo 100 caracteres.")
      .nullable()
      .optional(),
    fatorPotenciaPoloFechadoB: z.coerce
      .string()

      .max(100, "Máximo 100 caracteres.")
      .nullable()
      .optional(),
    fatorPotenciaPoloFechadoC: z.coerce
      .string()

      .max(100, "Máximo 100 caracteres.")
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
    descricaoAvaliacao: z.coerce
      .string()
      .max(500, "Máximo 500 caracteres.")
      .optional(),

    observacao: z.coerce
      .string()
      .max(1000, "Resuma em no máximo 1000 caracteres.")
      .optional(),
  })
  .strict();

const malhaAterramentoSchema = z.object({
  // Corrigido para aceitar um valor maior e ser nulo/opcional
  valorResistencia: z.coerce
    .string()

    .max(100, "Máximo 100 caracteres.")
    .nullable()
    .optional(),

  observacao: z.coerce
    .string()
    .max(1000, "Resuma em no máximo 1000 caracteres.")
    .optional(),

  avaliacao: z.enum(["CONFORME", "NAO_CONFORME"]).nullable().optional(),
  descricaoAvaliacao: z.coerce
    .string()
    .max(500, "Máximo 500 caracteres.")
    .optional(),
  servico1: z.enum(["SIM", "NAO", "N/A"]).optional(),
  servico2: z.enum(["SIM", "NAO", "N/A"]).optional(),
});

const resistorAterramentoSchema = z.object({
  // Corrigido para aceitar nulo e ser opcional
  resistenciaNominal: z.coerce
    .number()

    .max(100, "Máximo 100 caracteres.")
    .nullable()
    .optional(),
  resistenciaOhmicaMedida: z.coerce
    .number()

    .max(100, "Máximo 100 caracteres.")
    .nullable()
    .optional(),
  resistenciaIsolamento: z.coerce
    .number()

    .max(100, "Máximo 100 caracteres.")
    .nullable()
    .optional(),
  observacao: z.coerce
    .string()
    .max(1000, "Resuma em no máximo 1000 caracteres.")
    .optional(),
  avaliacao: z.enum(["CONFORME", "NAO_CONFORME"]).optional(),
  descricaoAvaliacao: z.coerce
    .string()
    .max(500, "Máximo 500 caracteres.")
    .optional(),
});

const chaveSeccionadoraSchema = z.object({
  correnteAplicada: z.coerce
    .string()

    .max(100, "Máximo 100 caracteres.")
    .optional(),
  tensaoEnsaio: z.coerce
    .string()

    .max(100, "Máximo 100 caracteres.")
    .optional(),
  valorReferencia1: z.coerce
    .string()
    .min(1, "Minimo 1 dígito")
    .max(300, "Máximo 300 dígitos.")
    .optional(),
  valorReferencia2: z.coerce
    .string()

    .max(100, "Máximo 100 caracteres.")
    .optional(),
  tempoEnsaio: z.coerce.string().max(100, "Máximo 100 caracteres.").optional(),

  resistenciaContatoA: z.coerce
    .string()

    .max(100, "Máximo 100 caracteres.")
    .nullable()
    .optional(),
  resistenciaContatoB: z.coerce
    .string()

    .max(100, "Máximo 100 caracteres.")
    .nullable()
    .optional(),
  resistenciaContatoC: z.coerce
    .string()

    .max(100, "Máximo 100 caracteres.")
    .nullable()
    .optional(),
  resistenciaIsolamentoA: z.coerce
    .string()

    .max(5000)
    .nullable()
    .optional(),
  resistenciaIsolamentoB: z.coerce
    .string()

    .max(5000)
    .nullable()
    .optional(),
  resistenciaIsolamentoC: z.coerce
    .string()

    .max(5000)
    .nullable()
    .optional(),

  servico1: z.enum(["SIM", "NAO", "N/A"]).optional(),
  servico2: z.enum(["SIM", "NAO", "N/A"]).optional(),
  servico3: z.enum(["SIM", "NAO", "N/A"]).optional(),
  servico4: z.enum(["SIM", "NAO", "N/A"]).optional(),

  avaliacao: z.enum(["CONFORME", "NAO_CONFORME"]).optional(),
  descricaoAvaliacao: z.coerce
    .string()
    .max(500, "Máximo 500 caracteres.")
    .optional(),

  observacao: z.coerce
    .string()
    .max(1000, "Resuma em no máximo 1000 caracteres.")
    .optional(),
});

const pararaioSchema = z.object({
  numeroSerie: z
    .array(z.coerce.string().max(100, "Máximo de 100 caracteres."))
    .nullable()
    .optional(),
  tensaoEnsaio: z.coerce
    .string()
    .max(100, "Máximo de 100 caracteres.")
    .nullable()
    .optional(),
  valorMedido: z
    .array(z.coerce.string().max(100, "Máximo de 100 caracteres."))
    .nullable()
    .optional(),
  valorReferencia: z
    .array(z.coerce.string().max(100, "Máximo de 100 caracteres."))
    .nullable()
    .optional(),
  tempoEnsaio: z.coerce
    .string()
    .max(100, "Máximo de 100 caracteres.")
    .nullable()
    .optional(),
});

// Fazendo
const caboMuflaSchema = z.object({
  tensaoEnsaio: z.coerce
    .string()

    .max(100, "Máximo 100 caracteres.")
    .nullable()
    .optional(),
  valorReferencia: z.coerce
    .string()

    .max(100, "Máximo 100 caracteres.")
    .nullable()
    .optional(),
  tempoEnsaio: z.coerce
    .string()

    .max(100, "Máximo 100 caracteres.")
    .nullable()
    .optional(),
  resistenciaIsolamentoX0xMassa: z.coerce
    .string()

    .max(100, "Máximo 100 caracteres.")
    .nullable()
    .optional(),
  resistenciaIsolamentoX11xMassa: z.coerce
    .string()

    .max(100, "Máximo 100 caracteres.")
    .nullable()
    .optional(),
  resistenciaIsolamentoX12xMassa: z.coerce
    .string()

    .max(100, "Máximo 100 caracteres.")
    .nullable()
    .optional(),
  resistenciaIsolamentoX21xMassa: z.coerce
    .string()

    .max(100, "Máximo 100 caracteres.")
    .nullable()
    .optional(),
  resistenciaIsolamentoX22xMassa: z.coerce
    .string()

    .max(100, "Máximo 100 caracteres.")
    .nullable()
    .optional(),
  resistenciaIsolamentoX31xMassa: z.coerce
    .string()

    .max(100, "Máximo 100 caracteres.")
    .nullable()
    .optional(),
  resistenciaIsolamentoX32xMassa: z.coerce
    .string()

    .max(100, "Máximo 100 caracteres.")
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
  descricaoAvaliacao: z.coerce
    .string()
    .max(500, "Máximo 500 caracteres.")
    .optional(),

  observacao: z.coerce
    .string()
    .max(1000, "Resuma em no máximo 1000 caracteres.")
    .optional(),
});
// Feito
const tpBuchaSchema = z
  .object({
    numeroSerieBucha: z.coerce
      .string()

      .max(100, "Máximo 100 caracteres.")
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

export const schemasPorTipo = {
  TRAFO_ALTA: trafoAltaSchema,
  TRAFO_POTENCIA: trafoCorrenteSchema,
  TRAFO_FORCA: trafoAltaSchema,
  TRAFO_MEDIA: trafoMediaSchema,
  TRAFO_CORRENTE: trafoCorrenteSchema,
  DISJUNTOR_ALTA: disjuntorSchema,
  DISJUNTOR_MEDIA: disjuntorSchema,
  DISJUNTOR_BAIXA: disjuntorSchema,
  RESISTOR: resistorAterramentoSchema,
  CHAVE_SECCIONADORA: chaveSeccionadoraSchema,
  CHAVE_SECCIONADORA_ALTA: chaveSeccionadoraSchema,
  CHAVE_SECCIONADORA_MEDIA: chaveSeccionadoraSchema,
  MALHA: malhaAterramentoSchema,
  CABOMUFLA: caboMuflaSchema,
  PARARAIO: pararaioSchema,
  BUCHA: tpBuchaSchema,
};
