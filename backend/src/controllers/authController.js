import prisma from "../config/prisma.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";

export const login = async (req, res) => {
  const { cpf, senha } = req.body;
  const user = await prisma.Multiplicador.findUnique({
    where: { cpf },
  });

  if (!user) return res.status(404).json({ message: "Usuário não encontrado" });

  const valid = await bcrypt.compare(senha, user.senha);
  if (!valid) return res.status(401).json({ message: "Senha incorreta" });

  const token = generateToken(user.id);

  const { senha: _, ...userWithoutPassword } = user;

  res.cookie("token", token, {
    httpOnly: true, // Segurança: não acessível via JavaScript
    secure: true, // HTTPS apenas
    sameSite: "strict", // Proteção contra CSRF
    maxAge: 3600000, // 1 hora em ms
  });

  res.json({
    token,
    user: userWithoutPassword,
  });
};
