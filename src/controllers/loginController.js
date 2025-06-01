import dotenv from "dotenv";
import jwt from "jsonwebtoken";

import { PrismaClient } from "../generated/prisma/index.js";
import { loginSchema } from "../validations/schema.js";

dotenv.config();

const prisma = new PrismaClient();

export const login = async (req, res) => {
  try {
    const validateLogin = loginSchema.safeParse(req.body);

    if (!validateLogin.success)
      return res
        .status(400)
        .json({ status: false, message: "Erro de validação." });

    const { username, password } = req.body;
    const employeeExist = await prisma.employee.findUnique({
      where: { username },
    });

    if (!employeeExist)
      return res
        .status(401)
        .json({ status: false, message: "Funcionário não encontrado" });

    if (password !== employeeExist.password)
      return res
        .status(401)
        .json({ status: false, message: "Senha incorreta" });

    const token = jwt.sign(
      {
        employeeId: employeeExist.id,
        role: employeeExist.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      status: true,
      message: "Usuário logado com sucesso",
      name: employeeExist.name,
      role: employeeExist.role,
      token,
    });
  } catch (error) {
    res.status(500).json({ status: false, message: "Erro no login" });
  }
};
