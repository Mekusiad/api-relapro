import { validarRelacionamentoParams } from "../utils/validarRelacionamento.js";


export const verificarRelacionamentoMiddleware = async (req, res, next) => {
  const { numeroOs, subestacaoId, componenteId } = req.validatedData.params;

  const valido = await validarRelacionamentoParams(
    numeroOs,
    subestacaoId,
    componenteId
  );    

  if (!valido) {
    return res.status(404).json({
      status: false,
      message: "Componente não encontrado nesta subestação ou ordem de serviço.",
    });
  }

  next(); // tudo certo, segue para o controller
};
