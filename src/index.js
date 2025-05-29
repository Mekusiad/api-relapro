import dotenv from "dotenv";
import express from "express";
import cors from "cors";

// import { PrismaClient } from "@prisma/client";

dotenv.config();

const app = express();

// const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());
app.use("uploads", express.static("src/uploads"));

app.get("/ping", (req, res) => res.send("🛠️ API está online!"));

const PORT = process.env.PORT || 3000;
