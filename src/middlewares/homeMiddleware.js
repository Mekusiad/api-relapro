import { ensaioSchema, schemasPorTipo } from "../validations/schema.js";

export const homeInfoMiddleware = (schema, source = "body") => {
  return (req, res, next) => {
    let data;

    if (source === "custom") {
      data = { funcionarioMatricula: req.funcionarioMatricula };
    } else {
      data = req[source];
    }

    const result = schema.safeParse(data);

    if (!result.success) {
      return res.status(400).json({
        status: false,
        message: `Erro de validação .`,
        errors: result.error.format(),
      });
    }

    req.validatedData = result.data; // anexa dados validados
    next();
  };
};

export const registrarFuncionarioMiddleware = (schema, source = "body") => {
  return (req, res, next) => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      return res.status(400).json({
        status: false,
        message: "Erro de validação.",
        errors: result.error.format(),
      });
    }

    req.validatedData = result.data;
    next();
  };
};

export const validateReq = (schema, source = "body") => {
  return (req, res, next) => {
    console.log("Entrou no validateReq");

    let data;

    if (source === "custom") {
      data = { funcionarioMatricula: req.funcionarioMatricula };
    } else {
      data = req[source];
    }

    const result = schema.safeParse(data);
    if (!result.success) {
      return res.status(400).json({
        status: false,
        message: "Erro de validação.",
        errors: result.error.format(),
      });
    }
    req.validatedData = result.data; // anexa dados validados
    next();
  };
};

export const validateGenerico = (schema) => {
  return (req, res, next) => {
    console.log("Entrou no validateGenerico");

    const result = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query,
    });
    if (!result.success) {
      return res.status(400).json({
        status: false,
        message: "Erro de validação.",
        errors: result.error.format(),
      });
    }

    req.validatedData = result.data;
    next();
  };
};

export const validarEnsaioMiddleware = (ensaioSchema, schemasPorTipo) => {
  return (req, res, next) => {
    console.log("Entrou no validarEnsaioMiddleware");

    const dadosRequisicao = {
      body: req.body,
      params: req.params,
      query: req.query,
    };

    const parsed = ensaioSchema.safeParse(dadosRequisicao);

    console.log(JSON.stringify(parsed));
    if (!parsed.success) {
      return res.status(400).json({
        status: false,
        message: "Erro de validação da requisição",
        error: parsed.error.format(),
      });
    }

    const { tipo, dados } = parsed.data.body;
    const schemaDoTipo = schemasPorTipo[tipo];

    if (!tipo || !schemaDoTipo) {
      return res.status(400).json({
        status: false,
        message: "Tipo de ensaio desconhecido ou inválido.",
      });
    }

    const validDados = schemaDoTipo.safeParse(dados);

    if (!validDados.success) {
      return res.status(400).json({
        status: false,
        message: "Erro na validação dos dados do ensaio",
        error: validDados.error.format(),
      });
    }

    req.validatedData = {
      ...parsed.data,
      body: {
        ...parsed.data.body,
        dados: validDados.data,
      },
    };

    next();
  };
};
