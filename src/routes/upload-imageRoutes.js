import express from "express";

import { verifyToken } from "../middlewares/authMiddleware.js";
import { uploadImageController } from "../controllers/uploadImageController.js";
import { upload } from "../middlewares/uploadMiddleware.js";

export const uploadImageRoutes = express.Router();

// Middleware global de autenticação para todas as rotas abaixo
uploadImageRoutes.use(verifyToken);

// Rota principal do Dashboard

uploadImageRoutes.post(
  "/upload-fotos",
  upload.fields([
    { name: "fotosIniciaisInput", maxCount: 5 },
    { name: "fotosMedicaoInput", maxCount: 5 },
  ]),
  uploadImageController
);
