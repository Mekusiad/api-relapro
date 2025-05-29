import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const register = async () => {
  const { name, username, password, role } = req.body;

  try {
    const hash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        username,
        password: hash,
        role: role || "technician",
      },
    });

    res.status(201).json({
      status: true,
      id: user.id,
      name: user.name,
      username: user.username,
      role: user.role,
    });
  } catch (error) {
    res
      .status(500)
      .json({ status: false, message: "Erro ao registrar usuário" });
  }
};
