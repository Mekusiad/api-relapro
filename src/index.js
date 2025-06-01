import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { employeeRouter } from "./routes/employeeRoutes.js";
import { authRouter } from "./routes/authRoutes.js";

import { PrismaClient } from "./generated/prisma/index.js";
import { verifyToken } from "./middlewares/authMiddleware.js";

dotenv.config();

const app = express();

const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());
app.use("uploads", express.static("src/uploads"));

app.use("/api/auth", authRouter);
app.use("/api/employee", employeeRouter);
app.use("/api/order", verifyToken);
app.get("/", (req, res) => res.json("API rodando"));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Conectado na porta ${PORT}`);
});
