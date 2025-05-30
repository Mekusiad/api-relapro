import express from "express";

import { login } from "../controllers/loginController.js";

export const authRouter = express.Router();

authRouter.post("/login", login);
