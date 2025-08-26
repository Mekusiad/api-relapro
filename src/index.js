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

// Lista de origens permitidas (produção + local)
const allowedOrigins = [
  "https://relapro.vercel.app", // produção
  "http://localhost:3000", // React local (CRA)
  "http://localhost:5173", // Vite local
];

// Configuração dinâmica do CORS
const corsOptions = {
  origin: (origin, callback) => {
    // Permite requests sem "origin" (ex: Postman, curl)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`Origem ${origin} não permitida pelo CORS`));
    }
  },
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());

// Servir frontend estático (opcional)
app.use(express.static(path.join(__dirname, "..", "..", "frontend")));

// Servir uploads
app.use("/uploads", express.static("src/uploads"));

// Rotas API
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
