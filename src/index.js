import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { userRouter } from "./routes/userRoutes.js";
import { authRouter } from "./routes/authRoutes.js";

import { PrismaClient } from "./generated/prisma/index.js";

dotenv.config();

const app = express();

const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());
app.use("uploads", express.static("src/uploads"));

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.get("/", (req, res) => res.json("API rodando"));
// app.use("/api/order", orderRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Conectado na porta ${PORT}`);
});
