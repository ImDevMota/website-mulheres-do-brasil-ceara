import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // O Singleton que criamos
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const { cpf, senha } = await request.json();

    // 1. Buscar usuário pelo CPF
    const usuario = await prisma.multiplicador.findUnique({
      where: { cpf },
    });

    if (!usuario) {
      return NextResponse.json(
        {
          error: "CPF_NAO_REGISTRADO",
          message: "CPF não cadastrado no sistema",
        },
        { status: 401 }
      );
    }

    // 2. Verificar senha
    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      return NextResponse.json(
        {
          error: "SENHA_INCORRETA",
          message: "Senha incorreta",
        },
        { status: 401 }
      );
    }

    // 3. Gerar Token JWT
    const token = jwt.sign(
      { id: usuario.id, cpf: usuario.cpf },
      process.env.JWT_SECRET || "fallback_secret",
      { expiresIn: "1d" }
    );

    // 4. Salvar nos Cookies (Substitui a lógica manual do Express)
    const cookieStore = await cookies();
    cookieStore.set("token", token, {
      httpOnly: true, // Segurança: impede acesso via JS no browser
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 1 dia
    });

    return NextResponse.json({
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      token, // Retornando token para o frontend salvar (compatibilidade)
    });
  } catch (error) {
    console.error("Erro no Login:", error);
    return NextResponse.json(
      { error: "Erro interno no servidor" },
      { status: 500 }
    );
  }
}
