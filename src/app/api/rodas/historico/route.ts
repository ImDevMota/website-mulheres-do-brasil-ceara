import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // O Singleton que criamos
import { getUserIdFromToken } from "@/lib/auth";

export async function GET() {
  try {
    const userId = await getUserIdFromToken();

    if (!userId) {
      return NextResponse.json(
        { error: "Token inválido ou expirado" },
        { status: 401 }
      );
    }

    const rodas = await prisma.roda.findMany({
      include: {
        faixasEtarias: {
          include: { faixaEtaria: true },
        },
      },
      where: {
        multiplicadorId: Number(userId),
        status: "finalizada",
      },
      orderBy: { data: "desc" },
    });

    return NextResponse.json(rodas);
  } catch (error) {
    console.error("Erro ao listar rodas:", error);
    return NextResponse.json(
      { error: "Erro ao listar rodas" },
      { status: 500 }
    );
  }
}
