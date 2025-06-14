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
        message: "Erro de validação.",
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
