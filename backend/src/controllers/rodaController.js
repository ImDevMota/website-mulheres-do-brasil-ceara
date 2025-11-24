import prisma from "../config/prisma.js";
import { buscarCoordenadas } from "../services/geocoding.js";

export const listarRodas = async (req, res) => {
  try {
    const rodas = await prisma.roda.findMany({
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

    res.status(200).json(rodas);
  } catch (err) {
    console.error("Erro ao listar rodas:", err);
    res.status(400).json({ error: err.message });
  }
};

export const criarRoda = async (req, res) => {
  try {
    console.log("📥 Dados recebidos:", req.body);
    console.log("👤 Multiplicador ID:", req.userId);

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
    } = req.body;

    // Validação de campos obrigatórios
    if (
      !tema ||
      !data ||
      !hora_inicio ||
      !municipio ||
      !local ||
      !publico_alvo
    ) {
      console.log("❌ Campos obrigatórios faltando");
      return res.status(400).json({
        error:
          "Campos obrigatórios: tema, data, hora_inicio, municipio, local, publico_alvo",
      });
    }

    if (!req.userId) {
      console.log("❌ multiplicadorId não encontrado no token");
      return res.status(401).json({ error: "Usuário não autenticado" });
    }

    let coords = { latitude: null, longitude: null };

    // Coordenadas padrão por município (centro da cidade)
    const coordenadasPadrao = {
      Fortaleza: { latitude: -3.7172, longitude: -38.5433 },
      Sobral: { latitude: -3.6861, longitude: -40.35 },
      "Juazeiro do Norte": { latitude: -7.2131, longitude: -39.3151 },
      Acaraú: { latitude: -2.8858, longitude: -40.12 },
    };

    if (!latitude || !longitude) {
      console.log(`🔍 Buscando coordenadas para: ${local}, ${municipio}`);

      const geoData = await buscarCoordenadas(local, municipio);

      if (geoData) {
        coords = {
          latitude: geoData.latitude,
          longitude: geoData.longitude,
        };
        console.log(
          `✅ Coordenadas encontradas via geocoding: ${geoData.display_name}`
        );
      } else {
        console.log(
          "⚠️ Geocoding falhou, usando coordenadas padrão do município"
        );

        coords = coordenadasPadrao[municipio] || {
          latitude: null,
          longitude: null,
        };

        if (coords.latitude) {
          console.log(
            `✅ Usando coordenadas do centro de ${municipio}: [${coords.latitude}, ${coords.longitude}]`
          );
        } else {
          console.log(`⚠️ Município "${municipio}" não tem coordenadas padrão`);
        }
      }
    } else {
      coords = { latitude, longitude };
      console.log(
        `📍 Usando coordenadas fornecidas: [${latitude}, ${longitude}]`
      );
    }

    // Combinar data e hora
    const dataHoraInicio = `${data}T${hora_inicio}:00`;

    console.log("💾 Criando roda no banco...");

    const novaRoda = await prisma.roda.create({
      data: {
        multiplicadorId: req.userId,
        tema,
        data: new Date(data),
        hora_inicio: new Date(dataHoraInicio),
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
          select: {
            id: true,
            nome: true,
            email: true,
          },
        },
      },
    });

    console.log("✅ Roda criada com sucesso! ID:", novaRoda.id);
    res.status(201).json(novaRoda);
  } catch (err) {
    console.error("❌ Erro ao criar roda:", err);

    if (err.code === "P2002") {
      return res.status(400).json({
        error: "Já existe uma roda com esses dados",
      });
    }

    if (err.code === "P2003") {
      return res.status(400).json({
        error: "Multiplicador não encontrado",
      });
    }

    res.status(400).json({
      error: err.message,
      code: err.code || "UNKNOWN",
    });
  }
};
