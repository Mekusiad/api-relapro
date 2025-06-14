export const conferirNivelAcessoMiddleware = (...niveisPermitidos) => {
  return (req, res, next) => {
    const nivel = req.funcionarioNivelAcesso?.toString().toUpperCase();

    if (!nivel || !niveisPermitidos.includes(nivel)) {
      return res.status(403).json({
        status: false,
        message: "Você não tem permissão para realizar este tipo de ação.",
      });
    }

    next();
  };
};
