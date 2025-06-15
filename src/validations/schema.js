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

export const employeeSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório."),
  usuario: z.string().min(1, "Nome de usuário é obrigatório."),
  cargo: z.string().min(1, "Necessário preencher seu cargo."),
  admissao: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Data inválida",
    })
    .transform((val) => new Date(val)), // converte string em Date
  senha: z.string().min(1, "Senha é obrigatória."),
  nivelAcesso: z.enum(["admin", "técnico", "supervisor"], {
    errorMap: () => ({ message: "Função inválida" }),
  }),
});

export const orderSchema = z.object({
  numberOs: z.string().min(1, "Número da OS é obrigatório"),
  client: z.string().min(1, "Cliente é obrigatório"),
  contact: z.string().min(1, "Contato é obrigatório"),
  phone: z.string().min(1, "Telefone é obrigatório"),
  email: z.string().email("E-mail inválido"),
  localService: z.string().min(1, "Local de serviço é obrigatório"),
  initialDescription: z.string().min(1, "Descrição inicial é obrigatória"),

  status: z.enum(["aberta", "em_andamento", "finalizada"], {
    errorMap: () => ({ message: "Status inválido" }),
  }),

  previousInitialDate: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Data inicial inválida",
    })
    .transform((val) => new Date(val)),

  finishDate: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Data de finalização inválida",
    })
    .transform((val) => new Date(val))
    .optional(),

  responsibleTechnicianId: z
    .number()
    .int()
    .positive("ID do técnico é obrigatório"),
});

export const highTransformerSchema = z.object({
  nameEquipment: z.string().min(1, "Nome do equipamento é obrigatório"),
  client: z.string().min(1, "Cliente é obrigatório"),
  location: z.string().min(1, "Localização é obrigatória"),
  type: z.string().min(1, "Tipo é obrigatório"),
  manufacturer: z.string().min(1, "Fabricante é obrigatório"),
  serialNumber: z.string().min(1, "Número de série é obrigatório"),

  insulatingMedium: z.string().min(1, "Meio isolante é obrigatório"),
  yearManufacture: z.number().int().gte(1900, "Ano inválido"),

  totalMass: z.number().positive("Massa total deve ser maior que zero"),
  power: z.string().min(1, "Potência é obrigatória"),

  typeAt: z.string().min(1, "Tipo AT é obrigatório"),
  tensionAt: z.number().positive("Tensão AT inválida"),

  typeBt: z.string().min(1, "Tipo BT é obrigatório"),
  tensionBt: z.number().positive("Tensão BT inválida"),

  volumeIsulationOil: z
    .number()
    .nonnegative("Volume de óleo deve ser positivo"),
  testTemperature: z
    .number()
    .min(-50)
    .max(150)
    .refine((val) => !isNaN(val), {
      message: "Temperatura de teste inválida",
    }),

  relativeHumidity: z
    .number()
    .min(0)
    .max(100)
    .refine((val) => !isNaN(val), {
      message: "Umidade relativa deve estar entre 0 e 100",
    }),

  orderId: z.number().int().positive(),
});

export const potentialTransformerSchema = z.object({
  nameEquipment: z.string().min(1, "Nome do equipamento é obrigatório"),
  client: z.string().min(1, "Cliente é obrigatório"),
  location: z.string().min(1, "Localização é obrigatória"),
  type: z.string().min(1, "Tipo é obrigatório"),
  manufacturer: z.string().min(1, "Fabricante é obrigatório"),
  serialNumber: z.string().min(1, "Número de série é obrigatório"),

  insulatingMedium: z.string().min(1, "Meio isolante é obrigatório"),
  yearManufacture: z.number().int().gte(1900, "Ano inválido"),

  totalMass: z.number().positive("Massa total deve ser positiva"),
  power: z.string().min(1, "Potência é obrigatória"),

  typeAt: z.string().min(1, "Informe se ligação é X ou Y"),
  tensionAt: z.number().positive(),

  typeBt: z.string().min(1, "Informe se ligação é X ou Y"),
  tensionBt: z.number().positive(),

  volumeIsulationOil: z.number().nonnegative(),
  testTemperature: z.number().min(-50).max(150),
  relativeHumidity: z.number().min(0).max(100),

  tapComuAt: z.string().optional(),
  tapComuBt: z.string().optional(),

  relationCalculateAtBt: z.number(),
  relationMeasure1: z.number(),
  relationMeasure2: z.number(),
  relationMeasure3: z.number(),

  ohmicResistanceWindingAt1: z.number(),
  ohmicResistanceWindingAt2: z.number(),
  ohmicResistanceWindingAt3: z.number(),

  ohmicResistanceWindingBt1: z.number(),
  ohmicResistanceWindingBt2: z.number(),
  ohmicResistanceWindingBt3: z.number(),

  insulationResistanceAtBt: z.number(),
  insulationResistanceAtMass: z.number(),
  insulationResistanceBtMass: z.number(),

  observation: z.string().optional(),

  transformerProtection1: z.boolean(),
  transformerProtection2: z.boolean(),
  transformerProtection3: z.boolean(),
  transformerProtection4: z.boolean(),
  transformerProtection5: z.boolean(),
  transformerProtection6: z.boolean(),

  transformerProtectionObservation: z.string().optional(),

  orderId: z.number().int().positive(),
});

export const strengthTransformerSchema = z.object({
  nameEquipment: z.string().min(1, "Nome do equipamento é obrigatório"),
  client: z.string().min(1, "Cliente é obrigatório"),
  location: z.string().min(1, "Localização é obrigatória"),
  type: z.string().min(1, "Tipo é obrigatório"),
  manufacturer: z.string().min(1, "Fabricante é obrigatório"),
  serialNumber: z.string().min(1, "Número de série é obrigatório"),

  insulatingMedium: z.string().min(1, "Meio isolante é obrigatório"),
  yearManufacture: z.number().int().gte(1900, "Ano de fabricação inválido"),

  totalMass: z
    .number()
    .positive("Massa total deve ser um número positivo")
    .refine((val) => Number(val.toFixed(2)) === val, {
      message: "Massa total deve ter no máximo 2 casas decimais",
    }),
  power: z.string().min(1, "Potência é obrigatória"),
  voltage: z.string().min(1, "Tensão nominal é obrigatória"),

  highTension: z.number().positive("Alta tensão deve ser positiva"),
  lowTension: z.number().positive("Baixa tensão deve ser positiva"),

  volumeIsulationOil: z.number().nonnegative(),
  testTemperature: z.number().min(-50).max(150),
  relativeHumidity: z.number().min(0).max(100),

  orderId: z.number().int().positive(),
});

export const currentTransformerSchema = z.object({
  nameEquipment: z.string().min(1, "Nome do equipamento é obrigatório"),
  client: z.string().min(1, "Cliente é obrigatório"),
  location: z.string().min(1, "Localização é obrigatória"),
  type: z.string().min(1, "Tipo é obrigatório"),
  manufacturer: z.string().min(1, "Fabricante é obrigatório"),
  serialNumber: z.string().min(1, "Número de série é obrigatório"),
  insulatingMedium: z.string().min(1, "Meio isolante é obrigatório"),

  maxVoltage: z.number().positive("Tensão máxima deve ser positiva"),
  primaryCurrent: z.number().positive("Corrente primária deve ser positiva"),
  secondCurrent: z.number().positive("Corrente secundária deve ser positiva"),

  testTemperature: z
    .number()
    .min(-50)
    .max(150, "Temperatura de teste fora do intervalo aceitável"),
  relativeHumidity: z
    .number()
    .min(0)
    .max(100, "Umidade relativa deve estar entre 0 e 100"),

  accuracy: z.string().min(1, "Classe de exatidão é obrigatória"),
  yearManufacture: z.number().int().gte(1900, "Ano inválido"),

  relationMeasure: z.number().nonnegative(),
  relationOhmic: z.number().nonnegative(),

  insulationResistancePxS: z.number().int().nonnegative(),
  insulationResistancePxM: z.number().int().nonnegative(),
  insulationResistanceSxM: z.number().int().nonnegative(),

  observation: z.string().optional(),

  orderId: z.number().int().positive(),
});

export const circuitBreakerSchema = z.object({
  nameEquipment: z.string().min(1, "Nome do equipamento é obrigatório."),
  client: z.string().min(1, "Nome do cliente é obrigatório."),
  location: z.string().min(1, "Localização é obrigatória."),
  type: z.string().min(1, "O tipo é obrigatório."),
  manufacturer: z.string().min(1, "Fabricante é obrigatório."),
  serialNumber: z.string().min(1, "Número de série é obrigatório."),

  insulatingMedium: z.string().min(1, "Meio isolante é obrigatório"),
  nominalTension: z.number().nonnegative(),
  currentTension: z.number().nonnegative(),
  testTemperature: z.number(),
  relativeHumidity: z.number().min(0).max(100),

  typePressure: z.string(),
  pressure: z.number(),

  contactResistanceClosedA: z.number(),
  contactResistanceClosedB: z.number(),
  contactResistanceClosedC: z.number(),

  contactResistanceOpenA: z.number(),
  contactResistanceOpenB: z.number(),
  contactResistanceOpenC: z.number(),

  insulationResistanceAxM: z.number(),
  insulationResistanceBxM: z.number(),
  insulationResistanceCxM: z.number(),

  services1: z.boolean(),
  services2: z.boolean(),
  services3: z.boolean(),
  services4: z.boolean(),

  observation: z.string().optional(),

  orderId: z.number().int().positive(),
});

export const groundingMeshSchema = z.object({
  client: z.string().min(1, "Nome do cliente é obrigatório."),
  location: z.string().min(1, "Localização é obrigatória."),
  resistance: z.string().min(1, "A resistência é obrigatória."),
  service1: z.enum(["Sim", "Não", "Não aplicável"]),
  service2: z.enum(["Sim", "Não", "Não aplicável"]),
  observations: z.string().optional(),
  yearManufacture: z.number().int().gte(1900),

  orderId: z.number().int().positive(),
});

export const groundingResistorSchema = z.object({
  nameEquipment: z.string().min(1, "Nome do equipamento é obrigatório"),
  client: z.string().min(1, "Cliente é obrigatório"),
  location: z.string().min(1, "Localização é obrigatória"),
  type: z.string().min(1, "Tipo é obrigatório"),
  manufacturer: z.string().min(1, "Fabricante é obrigatório"),
  serialNumber: z.string().min(1, "Número de série é obrigatório"),
  tag: z.string().min(1, "A tag é obrrigatória."),
  model: z.string().min(1, "O modelo é obrigatório."),

  tension: z.number().int().nonnegative(),
  nominalCurrent: z.number().int().nonnegative(),
  testTemperature: z.number(),
  relativeHumidity: z.number().min(0).max(100),
  frequency: z.number(),
  totalMass: z.number().int().nonnegative(),
  ohmicResistanceMeasurement: z.number(),
  insulationResistance: z.number().int().nonnegative(),
  observation: z.string().optional(),

  orderId: z.number().int().positive(),
});

export const disconnectorSwitchSchema = z.object({
  nameEquipment: z.string().min(1, "O nome do equipamento é obrigatório."),
  client: z.string().min(1, "O nome do cliente é obrigatório."),
  location: z.string().min(1, "Localização é necessário."),
  identification: z.string().min(1, "Identificação é obrigatório"),
  type: z.string().min(1, "O tipo é obrigatório."),
  manufacturer: z.string().min(1, "Fabricante é obrigatório."),
  serialNumber: z.string().min(1, "Número de série é obrigatório."),

  nominalTension: z
    .number({
      required_error: "Tensão nominal é obrigatória.",
      invalid_type_error: "Tensão nominal deve ser um número.",
    })
    .min(1, { message: "A tensão nominal deve ser no mínimo 1." }),
  nominalCurrent: z
    .number({
      required_error: "Corrente nominal é obrigatória.",
      invalid_type_error: "Corrente nominal deve ser um número.",
    })
    .min(1, { message: "A corrente nominal deve ser no mínimo 1." }),
  testTemperature: z
    .number({
      required_error: "Temperatura de ensaio é obrigatória.",
      invalid_type_error: "A Temperatura de ensaio deve ser um número.",
    })
    .min(1, { message: "A Temperatura de ensaio deve ser no mínimo 1." }),
  relativeHumidity: z.number().min(0).max(100),

  contactResistanceA: z.number(),
  contactResistanceB: z.number(),
  contactResistanceC: z.number(),

  insulationResistanceA: z.number(),
  insulationResistanceB: z.number(),
  insulationResistanceC: z.number(),

  observation: z.string().optional(),

  orderId: z.number().int().positive(),
});

export const equipmentSchema = z.object({
  name: z.string().min(1, "Nome do equipamento é obrigatório."),
  description: z.string().min(1, "Descrição do equipamento é obrigatório."),
  model: z.string().min(1, "Modelo é obrigatório"),
  serialNumber: z.string().min(1, "O número de série é obrigatório."),

  groundingMeshId: z.number().int().positive(),
  groundingResistorId: z.number().int().positive(),
  disconnectorSwitchId: z.number().int().positive(),
  currentTransformerId: z.number().int().positive(),
  circuitBreakerId: z.number().int().positive(),
  potentialTransformerId: z.number().int().positive(),
});
