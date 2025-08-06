import express from "express";

import { verifyToken } from "../middlewares/authMiddleware.js";
import { uploadImageController } from "../controllers/uploadImageController.js";
import { uploadFields } from "../middlewares/uploadMiddleware.js";

export const uploadImageRoutes = express.Router();

uploadImageRoutes.use(verifyToken);

uploadImageRoutes.post("/upload-fotos", uploadFields, uploadImageController);
