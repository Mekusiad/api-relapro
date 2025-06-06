import dotenv from "dotenv";
import express from "express";
import cors from "cors";

import { PrismaClient } from "./generated/prisma/index.js";

import { loginRoutes } from "./routes/loginRoutes.js";
import { homeRoutes } from "./routes/homeRoutes.js";
import { funcionarioRoutes } from "./routes/funcionarioRoutes.js";
import { ordemRoutes } from "./routes/ordemRoutes.js";

dotenv.config();

const app = express();

const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());
app.use("uploads", express.static("src/uploads"));

app.use("/api", loginRoutes);
app.use("/api", homeRoutes);
app.use("/api", funcionarioRoutes);
app.use("/api", ordemRoutes);

app.get("/", (req, res) => res.json("API rodando"));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Conectado na porta ${PORT}`);
});
