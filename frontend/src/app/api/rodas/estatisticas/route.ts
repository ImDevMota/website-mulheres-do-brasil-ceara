import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // O Singleton que criamos
import { getUserIdFromToken } from "@/lib/auth";

export async function GET() {
  try {
    const userId = getUserIdFromToken();

    if (!userId) {
      return NextResponse.json(
        { error: "Token inválido ou expirado" },
        { status: 401 }
      );
    }

    const rodas = await prisma.roda.findMany({
      where: {
        multiplicadorId: Number(userId),
        status: "finalizada",
      },
      include: {
        faixasEtarias: {
          include: {
            faixaEtaria: true,
          },
        },
      },
    });

    // Processar dados por município
    const municipios: Record<string, number> = {};
    rodas.forEach((roda) => {
      const municipio = roda.municipio || "Não informado";
      municipios[municipio] = (municipios[municipio] || 0) + 1;
    });

    // Processar dados por faixa etária
    const faixasEtarias: Record<string, number> = {};
    rodas.forEach((roda) => {
      roda.faixasEtarias.forEach((rel) => {
        const nome = rel.faixaEtaria.nome;
        faixasEtarias[nome] = (faixasEtarias[nome] || 0) + 1;
      });
    });

    const resultado = {
      totalRodas: rodas.length,
      municipios,
      faixasEtarias,
      municipiosCount: Object.keys(municipios).length,
      faixasEtariasCount: Object.keys(faixasEtarias).length,
    };

    return NextResponse.json(resultado);
  } catch (error) {
    console.error("Erro ao listar rodas:", error);
    return NextResponse.json(
      { error: "Erro ao listar rodas" },
      { status: 500 }
    );
  }
}
