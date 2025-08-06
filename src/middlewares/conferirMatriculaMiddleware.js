export const conferirMatriculaMiddleware = (paramsName = "matricula") => {
  return (req, res, next) => {
    const decodedMatricula = req.funcionarioMatricula;
    const paramsMatricula = req.params[paramsName];

    if (decodedMatricula !== paramsMatricula) {
      return res.status(403).json({
        status: false,
        message: "Acesso negado: matrícula não corresponde.",
      });
    }

    next();
  };
};
