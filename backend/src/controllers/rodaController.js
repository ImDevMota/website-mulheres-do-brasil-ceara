import prisma from "../config/prisma.js";
import { buscarCoordenadas } from "../services/geocoding.js";

export const verificarToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ message: "Token não fornecido" });
  }

  try {
    // Verifica e decodifica o token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Adiciona o ID do usuário na requisição
    req.usuarioId = decoded.id;

    next();
  } catch (error) {
    return res.status(401).json({ message: "Token inválido ou expirado" });
  }
};

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

export const listarRodasMultiplicador = async (req, res) => {
  try {
    const usuarioId = req.userId; // ID extraído do token JWT

    // ===== DEBUG - ADICIONE ISSO =====
    console.log("=== DEBUG LISTAR RODAS ===");
    console.log("Usuario ID do token:", usuarioId);
    console.log("Tipo do usuarioId:", typeof usuarioId);
    // =================================

    // Busca APENAS as rodas do usuário autenticado
    const rodas = await prisma.roda.findMany({
      where: {
        multiplicadorId: usuarioId, // ⚠️ Verifique se o nome do campo está correto
        status: "ativa",
      },
      orderBy: {
        data: "asc",
      },
    });

    // ===== DEBUG - ADICIONE ISSO =====
    console.log("Rodas encontradas:", rodas.length);
    console.log(
      "Usuario IDs das rodas:",
      rodas.map((r) => r.usuario_id)
    );
    // =================================

    res.status(200).json(rodas);
  } catch (error) {
    console.error("Erro ao buscar rodas:", error);
    return res.status(500).json({ message: "Erro ao buscar rodas" });
  }
};

export const listarRodasHistorico = async (req, res) => {
  try {
    const usuarioId = req.userId; // ID extraído do token JWT

    // ===== DEBUG - ADICIONE ISSO =====
    console.log("=== DEBUG LISTAR RODAS ===");
    console.log("Usuario ID do token:", usuarioId);
    console.log("Tipo do usuarioId:", typeof usuarioId);
    // =================================

    // Busca APENAS as rodas do usuário autenticado
    const rodas = await prisma.roda.findMany({
      where: {
        multiplicadorId: usuarioId, // ⚠️ Verifique se o nome do campo está correto
        status: "finalizada",
      },
      orderBy: {
        data: "asc",
      },
    });

    // ===== DEBUG - ADICIONE ISSO =====
    console.log("Rodas encontradas:", rodas.length);
    console.log(
      "Usuario IDs das rodas:",
      rodas.map((r) => r.usuario_id)
    );
    // =================================

    res.status(200).json(rodas);
  } catch (error) {
    console.error("Erro ao buscar rodas:", error);
    return res.status(500).json({ message: "Erro ao buscar rodas" });
  }
};

export const encerrarRoda = async (req, res) => {
  try {
    const usuarioId = req.usuarioId;
    const { rodaId, fotoFrequencia, fotoRodaConversa, resumo } = req.body;

    // ⚠️ DEBUG - Adicione para ver o que está chegando
    console.log("=== ENCERRAR RODA ===");
    console.log("Usuario ID:", usuarioId);
    console.log("Roda ID:", rodaId);
    console.log("Tipo do rodaId:", typeof rodaId);
    console.log("Resumo length:", resumo?.length);

    // ⚠️ IMPORTANTE: Converte rodaId para Number
    const rodaIdNumber = Number(rodaId);

    if (isNaN(rodaIdNumber)) {
      return res.status(400).json({ message: "ID da roda inválido" });
    }

    // Verifica se a roda pertence ao usuário
    const roda = await prisma.roda.findFirst({
      where: {
        id: rodaIdNumber, // ← Usa o número convertido
        multiplicadorId: usuarioId, // ⚠️ IMPORTANTE: Use multiplicadorId em vez de usuario_id
      },
    });

    if (!roda) {
      console.log(
        "Roda não encontrada para usuário:",
        usuarioId,
        "rodaId:",
        rodaIdNumber
      );
      return res
        .status(403)
        .json({ message: "Você não tem permissão para encerrar esta roda" });
    }

    // ⚠️ CRÍTICO: Use os nomes corretos dos campos do Prisma
    const rodaEncerrada = await prisma.roda.update({
      where: { id: rodaIdNumber },
      data: {
        status: "finalizada",
        fotoFrequenciaUrl: fotoFrequencia, // ← Nome correto
        fotoRodaUrl: fotoRodaConversa, // ← Nome correto
        resumo: resumo,
      },
    });

    console.log("✅ Roda encerrada com sucesso:", rodaEncerrada.id);

    return res.json(rodaEncerrada);
  } catch (error) {
    console.error("❌ ERRO AO ENCERRAR RODA:", error);
    console.error("Mensagem:", error.message);
    console.error("Stack:", error.stack);
    return res.status(500).json({
      message: "Erro ao encerrar roda",
      error: error.message, // ← Retorna a mensagem de erro para debug
    });
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
