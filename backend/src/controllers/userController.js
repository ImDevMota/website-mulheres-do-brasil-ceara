import prisma from "../config/prisma.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";

export const createUser = async (req, res) => {
  try {
    const { nome, cpf, email, senha, telefone, estado, municipio, profissao } =
      req.body;

    const hashedPassword = await bcrypt.hash(senha, 10);
    const user = await prisma.Multiplicador.create({
      // ← Mudança aqui
      data: {
        nome,
        cpf,
        email,
        senha: hashedPassword,
        telefone,
        estado,
        municipio,
        profissao,
      },
    });

    const token = generateToken(user.id);
    res.status(201).json({ user, token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
