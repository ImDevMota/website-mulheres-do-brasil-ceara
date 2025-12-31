import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // O Singleton que criamos
import { getUserIdFromToken } from "@/lib/auth";

export async function GET() {
  try {
    const userId = await getUserIdFromToken();

    const usuario = await prisma.multiplicador.findUnique({
      where: { id: userId! },
      select: {
        id: true,
        nome: true,
        genero: true,
        email: true,
        cpf: true,
        estado: true,
        municipio: true,
      },
    });

    if (!usuario) {
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(usuario);
  } catch (error) {
    console.error("Erro no GET ME:", error);
    return NextResponse.json(
      { error: "Token inválido ou expirado" },
      { status: 401 }
    );
  }
}
