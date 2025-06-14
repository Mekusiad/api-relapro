import jwt from "jsonwebtoken";

import { PrismaClient } from "../generated/prisma/index.js";

import { loginSchema } from "../validations/schema.js";

const prisma = new PrismaClient();

export const loginService = async (req, res) => {
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
      .json({ status: false, message: "Usuário ou senha incorreto." });

  if (senha !== funcionarioExiste.senha)
    return res
      .status(401)
      .json({ status: false, message: "Usuário ou senha incorreto." });

  const token = jwt.sign(
    {
      matricula: funcionarioExiste.matricula,
      nivelAcesso: funcionarioExiste.nivelAcesso,
    },
    process.env.JWT_SECRET,
    { expiresIn: "8h" }
  );

  res.status(200).json({
    status: true,
    message: "Usuário logado com sucesso",
    token,
  });
};
