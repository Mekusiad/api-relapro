import bcrypt from "bcrypt";

import { PrismaClient } from "../generated/prisma/index.js";

const prisma = new PrismaClient();

export const register = async (req, res) => {
  const { name, username, employeeRole, hireDate, password, role } = req.body;

  const usernameExist = await prisma.employee.findUnique({
    where: { username },
  });

  if (usernameExist)
    return res.status(401).json({
      status: false,
      message: "Nome de usuário existente, tente outro.",
    });

  try {
    const hash = await bcrypt.hash(password, 10);
    const user = await prisma.employee.create({
      data: {
        name,
        username,
        employeeRole,
        hireDate,
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
