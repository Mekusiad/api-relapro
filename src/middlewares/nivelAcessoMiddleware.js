export const nivelAcessoMiddleware = (...funcoes) => {
  return (req, res, next) => {
    if (!funcoes.includes(req.funcionario.nivelAcesso)) {
      return res.status(403).json({ message: "Acesso negado" });
    }
    next();
  };
};

export const somenteAdminSupervisor = (req, res, next) => {
  if (
    req.funcionario.nivelAcesso !== "ADMIN" ||
    req.funcionario.nivelAcesso !== "SUPERVISOR"
  ) {
    return res.status(403).json({
      status: false,
      message: "Acesso restrito a administradores e supervisores",
    });
  }
  next();
};

export const somenteAdmin = () => {
  if (req.funcionario.nivelAcesso !== "ADMIN") {
    return res.status(403).json({
      status: false,
      message: "Acesso restrito a administradores",
    });
  }
  next();
};
