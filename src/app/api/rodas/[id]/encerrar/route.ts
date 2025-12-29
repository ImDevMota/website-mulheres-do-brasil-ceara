import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserIdFromToken } from "@/lib/auth";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 1. Validar Usuário
    const usuarioId = await getUserIdFromToken();
    if (!usuarioId) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    // 2. Validar IDs
    const { id } = await params;
    const rodaIdNumber = Number(id);
    if (isNaN(rodaIdNumber)) {
      return NextResponse.json(
        { error: "ID da roda inválido" },
        { status: 400 }
      );
    }

    // 3. Capturar Body
    const { fotoFrequencia, fotoRodaConversa, resumo, faixasEtarias } =
      await request.json();

    if (!Array.isArray(faixasEtarias) || faixasEtarias.length === 0) {
      return NextResponse.json(
        { error: "Selecione pelo menos uma faixa etária" },
        { status: 400 }
      );
    }

    // 4. Verificar Permissão (A roda pertence a este multiplicador?)
    const rodaOriginal = await prisma.roda.findFirst({
      where: { id: rodaIdNumber, multiplicadorId: usuarioId },
    });

    if (!rodaOriginal) {
      return NextResponse.json(
        { error: "Você não tem permissão para encerrar esta roda" },
        { status: 403 }
      );
    }

    // 5. Executar Transação no Prisma
    const rodaEncerrada = await prisma.$transaction(async (tx) => {
      // A. Atualizar os dados da Roda
      const rodaAtualizada = await tx.roda.update({
        where: { id: rodaIdNumber },
        data: {
          status: "finalizada",
          fotoFrequenciaUrl: fotoFrequencia,
          fotoRodaUrl: fotoRodaConversa,
          resumo: resumo,
        },
      });

      // B. Criar as relações com faixas etárias
      // Nota: No Prisma 7, usamos createMany para eficiência
      await tx.rodaFaixaEtaria.createMany({
        data: faixasEtarias.map((faixaId) => ({
          rodaId: rodaIdNumber,
          faixaEtariaId: faixaId,
        })),
      });

      return rodaAtualizada;
    });

    return NextResponse.json(rodaEncerrada);
  } catch (error: any) {
    console.error("Erro ao encerrar roda:", error);
    return NextResponse.json(
      { error: "Erro ao encerrar roda", details: error.message },
      { status: 500 }
    );
  }
}
