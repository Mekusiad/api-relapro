import { home } from "../services/hoveServices.js";

import { handleError } from "../utils/errorHandler.js";

export const homeController = async (req, res) => {
  try {
    await home(req, res);
  } catch (error) {
    return handleError(res, error, error.message);
  }
};
