import { PrismaClient } from "../generated/prisma/index.js";

const prisma = new PrismaClient();

export const register = async (req, res) => {
  const { name, username, employeeRole, hireDate, password, accessLevel } =
    req.body;

  const usernameExist = await prisma.employee.findUnique({
    where: { username },
  });

  if (usernameExist)
    return res.status(401).json({
      status: false,
      message: "Nome de usuário existente, tente outro.",
    });

  try {
    const employee = await prisma.employee.create({
      data: {
        name,
        username,
        employeeRole,
        hireDate,
        password,
        accessLevel: accessLevel || "técnico",
      },
    });

    res.status(201).json({
      status: true,
      id: employee.id,
      name: employee.name,
      username: employee.username,
      accessLevel: employee.accessLevel,
    });
  } catch (error) {
    res
      .status(500)
      .json({ status: false, message: "Erro ao registrar usuário" });
  }
};
