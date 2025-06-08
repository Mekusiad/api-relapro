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

app.get("/", (req, res) => res.json("API rodando"));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Conectado na porta ${PORT}`);
});
