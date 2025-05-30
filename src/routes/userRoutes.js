import express from "express";

import { register } from "../controllers/registerUserController.js";

export const userRouter = express.Router();

userRouter.post("/register", register);
