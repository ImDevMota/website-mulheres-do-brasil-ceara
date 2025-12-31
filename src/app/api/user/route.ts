import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // O Singleton que criamos
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(request: Request) {
  try {
    const {
      nome,
      genero,
      cpf,
      email,
      estado,
      municipio,
      profissao,
      telefone,
      senha,
    } = await request.json();

    // 1. Buscar usuário pelo CPF
    const usuario = await prisma.multiplicador.findUnique({
      where: { cpf },
    });

    if (usuario) {
      return NextResponse.json({ error: "CPF já cadastrado" }, { status: 401 });
    }

    const hashedPassword = await bcrypt.hash(senha, 10);

    const multiplicador = await prisma.multiplicador.create({
      data: {
        nome,
        genero,
        cpf,
        email,
        estado,
        municipio,
        profissao,
        telefone,
        senha: hashedPassword,
      },
    });

    const token = jwt.sign(
      { id: multiplicador.id, cpf: multiplicador.cpf },
      process.env.JWT_SECRET || "fallback_secret",
      { expiresIn: "1d" }
    );

    return NextResponse.json({ multiplicador, token });
  } catch (error) {
    console.error("Erro no Cadastro:", error);
    return NextResponse.json(
      { error: "Erro interno no servidor" },
      { status: 500 }
    );
  }
}
