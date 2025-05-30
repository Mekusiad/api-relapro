import express from "express";

import { register } from "../controllers/userController.js";

export const userRouter = express.Router();

userRouter.post("/register", register);
