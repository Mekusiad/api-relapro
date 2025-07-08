import { uploadImage } from "../services/upload-imageService.js";
import { handleError } from "../utils/errorHandler.js";

export const uploadImageController = async (req, res) => {
  try {
    await uploadImage(req, res);
  } catch (error) {
    return handleError(res, error, error.message || "Erro ao enviar mensagem.");
  }
};
