import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { PrismaClient } from "@prisma/client";

dotenv.config();
const prisma = new PrismaClient();

export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { username } });

    if (!user)
      return res
        .status(401)
        .json({ status: false, message: "Usuário não encontrado" });

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid)
      return res
        .status(401)
        .json({ status: false, message: "Senha incorreta" });

    const token = jwt.sign(
      {
        userId: user.id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "2m" }
    );

    res.status(200).json({
      status: true,
      message: "Usuário logado com sucesso",
      name: user.name,
      role: user.role,
    });
  } catch (error) {
    res.status(500).json({ status: false, message: "Erro no login" });
  }
};
