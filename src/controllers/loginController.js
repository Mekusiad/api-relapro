import { loginService } from "../services/loginServices.js";
import { handleError } from "../utils/errorHandler.js";

export const loginController = async (req, res) => {
  try {
    await loginService(req, res);
  } catch (error) {
    return handleError(res, error, error.message);
  }
};
