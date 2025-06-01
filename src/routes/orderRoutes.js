import express from "express";

import { verifyToken } from "../middlewares/authMiddleware.js";
import { newOrder } from "../controllers/newOrderController.js";
import { updatedOrderController } from "../controllers/updatedOrderController.js";
import { getOrderController } from "../controllers/getOrderController.js";

export const orderRouter = express.Router();

orderRouter.post("/new-order", verifyToken, newOrder);
orderRouter.post(
  "/updated-order/:numberOs",
  verifyToken,
  updatedOrderController
);

orderRouter.get("/get-order/:numberOs", verifyToken, getOrderController);
