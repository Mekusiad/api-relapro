import express from "express";

import { register } from "../controllers/registerEmployeeController.js";

export const employeeRouter = express.Router();

employeeRouter.post("/register", register);
