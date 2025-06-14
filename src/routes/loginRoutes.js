import express from "express";

import { loginController } from "../controllers/loginController.js";

export const loginRoutes = express.Router();

loginRoutes.post("/login", loginController);
