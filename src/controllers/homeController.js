import { home } from "../services/homeServices.js";

import { handleError } from "../utils/errorHandler.js";

export const homeController = async (req, res) => {
  try {
    await home(req, res);
  } catch (error) {
    return handleError(res, error, error.message);
  }
};
