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

    const { usuario, senha } = req.body;
    const funcionarioExiste = await prisma.funcionario.findUnique({
      where: { usuario },
    });

    if (!funcionarioExiste)
      return res
        .status(401)
        .json({ status: false, message: "Funcionário não encontrado" });

    if (senha !== funcionarioExiste.senha)
      return res
        .status(401)
        .json({ status: false, message: "Senha incorreta" });

    const token = jwt.sign(
      {
        matricula: funcionarioExiste.matricula,
        cargo: funcionarioExiste.cargo,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      status: true,
      message: "Usuário logado com sucesso",
      nome: funcionarioExiste.nome,
      cargo: funcionarioExiste.cargo,
      token,
    });
  } catch (error) {
    res.status(500).json({ status: false, message: "Erro no login" });
  }
};
