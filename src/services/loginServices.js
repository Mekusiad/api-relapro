

import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import { loginSchema } from "../validations/schema.js";

const prisma = new PrismaClient();

export const loginService = async (req, res) => {
  const validateLogin = loginSchema.safeParse(req.body);
  if (!validateLogin.success) {
    return res.status(400).json({
      status: false,
      message: "Erro de validação.",
      error: validateLogin.error,
    });
  }

  const { usuario, senha } = req.body;

  const funcionarioExiste = await prisma.funcionario.findUnique({
    where: { usuario },
  });

  if (!funcionarioExiste) {
    return res
      .status(401)
      .json({ status: false, message: "Usuário ou senha incorreto." });
  }

  
  const senhaCorreta = await bcrypt.compare(senha, funcionarioExiste.senha);

  if (!senhaCorreta)
    return res
      .status(401)
      .json({ status: false, message: "Usuário ou senha incorreto." });

  const token = jwt.sign(
    {
      matricula: funcionarioExiste.matricula,
      nivelAcesso: funcionarioExiste.nivelAcesso,
    },
    process.env.JWT_SECRET,
    { expiresIn: "12h" }
  );

 
  return res.status(200).json({
    status: true,
    message: "Usuário logado com sucesso",
    token,
  
  });
};
