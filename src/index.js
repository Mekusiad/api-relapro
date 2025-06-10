import dotenv from "dotenv";
import express from "express";
import cors from "cors";

import { loginRoutes } from "./routes/loginRoutes.js";
import { homeRoutes } from "./routes/homeRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("src/uploads"));

app.use("/api", loginRoutes);
app.use("/api", homeRoutes);

// Rota de verificação de status (acordar o app)
app.get("/status", (req, res) => {
  res.status(200).json({
    status: true,
    message: "Servidor acordado e operando normalmente 🟢",
    timestamp: new Date().toISOString(),
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Conectado na porta ${PORT}`);
});
