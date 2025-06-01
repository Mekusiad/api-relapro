import express from "express";

import { newOrder } from "../controllers/newOrderController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

export const orderRouter = express.Router();

orderRouter.post("/new-order", verifyToken, newOrder);
orderRouter.post("/update-order/:id", verifyToken, newOrder);
