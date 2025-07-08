import dotenv from "dotenv";
import express from "express";
import cors from "cors";

import path from "path";
import { fileURLToPath } from "url";

import { loginRoutes } from "./routes/loginRoutes.js";
import { homeRoutes } from "./routes/homeRoutes.js";
import { uploadImageRoutes } from "./routes/upload-imageRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "..", "..", "frontend")));

app.use("/uploads", express.static("src/uploads"));

app.use("/api", loginRoutes);
app.use("/api", homeRoutes);
app.use("/api", uploadImageRoutes);

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
