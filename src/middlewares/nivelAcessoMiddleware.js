export const nivelAcessoMiddleware = (funcoes) => {
  return (req, res, next) => {
    if (!funcoes.includes(req.funcionario.role)) {
      return res.status(403).json({ message: "Acesso negado" });
    }
    next();
  };
};
