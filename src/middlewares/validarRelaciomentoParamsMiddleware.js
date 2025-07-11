import { verificarParamsRelacionamento } from "../utils/verificarParamsRelacionamento.js";

export const verificarRelacionamentoMiddleware = async (req, res, next) => {
  const {
    params: { numeroOs, subestacaoId, componenteId },
  } = req.validatedData;

  const valido = await verificarParamsRelacionamento(
    numeroOs,
    subestacaoId,
    componenteId
  );

  if (!valido) {
    return res.status(404).json({
      status: false,
      message:
        "Componente não encontrado nesta subestação ou ordem de serviço.",
    });
  }

  next(); 
};
