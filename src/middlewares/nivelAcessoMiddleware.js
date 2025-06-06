export const nivelAcessoMiddleware = (...funcoes) => {
  return (req, res, next) => {
    if (!funcoes.includes(req.funcionarioNivelAcesso)) {
      return res.status(403).json({ message: "Acesso negado" });
    }
    next();
  };
};

export const somenteAdminSupervisor = (req, res, next) => {
  if (
    req.funcionarioNivelAcesso !== "ADMIN" &&
    req.funcionarioNivelAcesso !== "SUPERVISOR"
  ) {
    return res.status(403).json({
      status: false,
      message: "Acesso restrito a administradores e supervisores",
    });
  }
  next();
};

export const somenteAdmin = (req, res, next) => {
  if (req.funcionarioNivelAcesso !== "ADMIN") {
    return res.status(403).json({
      status: false,
      message: "Acesso restrito a administradores",
    });
  }
  next();
};
