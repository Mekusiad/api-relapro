import express from "express";

import { verifyToken } from "../middlewares/authMiddleware.js";
import { newOrder } from "../controllers/newOrderController.js";
import { updatedOrderController } from "../controllers/updatedOrderController.js";
import { getOrderController } from "../controllers/getOrderController.js";

export const orderRouter = express.Router();

orderRouter.post("/new-order", verifyToken, newOrder);
orderRouter.post(
  "/updated-order/:numeroOs",
  verifyToken,
  updatedOrderController
);
orderRouter.put(
  "/updated-order/:numeroOs/add-dispositivo",
  verifyToken,
  updatedOrderController
);

orderRouter.get("/get-order/:numeroOs", verifyToken, getOrderController);
