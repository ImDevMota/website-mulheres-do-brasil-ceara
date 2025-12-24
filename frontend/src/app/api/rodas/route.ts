import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // O Singleton que criamos
import { getUserIdFromToken } from "@/lib/auth";
import { buscarCoordenadas } from "@/lib/geocoding";

export async function GET() {
  try {
    const rodas = await prisma.roda.findMany({
      where: {
        status: "ativa",
      },
      orderBy: {
        data: "asc",
      },
      include: {
        multiplicador: {
          select: {
            id: true,
            nome: true,
            email: true,
            municipio: true,
          },
        },
      },
    });

    if (!rodas) {
      return NextResponse.json(
        { error: "Rodas não encontradas" },
        { status: 404 }
      );
    }

    return NextResponse.json(rodas);
  } catch (error) {
    console.error("Erro ao listar rodas:", error);
    return NextResponse.json(
      { error: "Erro ao listar rodas" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const userId = getUserIdFromToken();

    if (!userId) {
      return NextResponse.json(
        { error: "Token inválido ou expirado" },
        { status: 401 }
      );
    }

    const body = await request.json();

    const {
      tema,
      data,
      hora_inicio,
      municipio,
      local,
      publico_alvo,
      numeroParticipantes,
      latitude,
      longitude,
    } = body;

    if (
      !tema ||
      !data ||
      !hora_inicio ||
      !municipio ||
      !local ||
      !publico_alvo
    ) {
      return NextResponse.json(
        {
          error:
            "Campos obrigatórios: tema, data, hora_inicio, municipio, local, publico_alvo",
        },
        { status: 400 }
      );
    }

    let coords: { latitude: number | null; longitude: number | null } = {
      latitude: null,
      longitude: null,
    };

    const coordenadasPadrao: Record<
      string,
      { latitude: number; longitude: number }
    > = {
      Fortaleza: { latitude: -3.7172, longitude: -38.5433 },
      Sobral: { latitude: -3.6861, longitude: -40.35 },
      "Juazeiro do Norte": { latitude: -7.2131, longitude: -39.3151 },
      Acaraú: { latitude: -2.8858, longitude: -40.12 },
      Aracati: { latitude: -4.56167, longitude: -37.7697 },
      Itapipoca: { latitude: -3.4944, longitude: -39.5789 },
      Quixadá: { latitude: -4.9708, longitude: -39.015 },
      Iguatu: { latitude: -6.35917, longitude: -39.29889 },
      Crateús: { latitude: -5.17833, longitude: -40.6775 },
      Tianguá: { latitude: -3.73167, longitude: -40.9917 },
      Tauá: { latitude: -6.00389, longitude: -40.2925 },
      "Limoeiro do Norte": { latitude: -5.14583, longitude: -38.0981 },
      Canindé: { latitude: -4.35917, longitude: -39.3131 },
      Camocim: { latitude: -2.9022, longitude: -40.8411 },
    };

    if (!latitude || !longitude) {
      const geoData = await buscarCoordenadas(local, municipio);

      if (geoData) {
        coords = {
          latitude: geoData.latitude,
          longitude: geoData.longitude,
        };
      } else {
        const baseCoords = coordenadasPadrao[municipio];
        if (baseCoords) {
          // Adiciona um pequeno "jitter" (variação) para evitar sobreposição exata
          // 0.005 graus é aproximadamente 500m
          const jitter = () => (Math.random() - 0.5) * 0.005;
          coords = {
            latitude: baseCoords.latitude + jitter(),
            longitude: baseCoords.longitude + jitter(),
          };
        } else {
          coords = {
            latitude: null,
            longitude: null,
          };
        }
      }
    } else {
      coords = { latitude, longitude };
    }

    // ========== CORREÇÃO DE FUSO ==========

    // A data está vindo como YYYY-MM-DD → criar sem UTC
    const partesData = data.split("-");
    const dataCorrigida = new Date(
      partesData[0],
      partesData[1] - 1,
      partesData[2]
    );

    // A hora está vindo como HH:mm
    const [h, m] = hora_inicio.split(":");
    const horaCorrigida = new Date(
      partesData[0],
      partesData[1] - 1,
      partesData[2],
      Number(h),
      Number(m)
    );

    const novaRoda = await prisma.roda.create({
      data: {
        multiplicadorId: Number(userId),
        tema,
        data: dataCorrigida,
        hora_inicio: horaCorrigida,
        municipio,
        local,
        publico_alvo,
        numeroParticipantes: numeroParticipantes
          ? parseInt(numeroParticipantes)
          : null,
        latitude: coords.latitude,
        longitude: coords.longitude,
        status: "ativa",
      },
      include: {
        multiplicador: {
          select: { id: true, nome: true, email: true },
        },
      },
    });

    return NextResponse.json(novaRoda, { status: 201 });
  } catch (error) {
    console.error("Erro no Login:", error);
    return NextResponse.json(
      { error: "Erro interno no servidor" },
      { status: 500 }
    );
  }
}
