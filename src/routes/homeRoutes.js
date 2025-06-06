import express from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { homeController } from "../controllers/homeController.js";

export const homeRoutes = express.Router();

homeRoutes.get("/", verifyToken, homeController);
