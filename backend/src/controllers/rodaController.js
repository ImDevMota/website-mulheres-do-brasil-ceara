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
    req.userId = decoded.id;

    next();
  } catch (error) {
    return res.status(401).json({ message: "Token inválido ou expirado" });
  }
};

export const listarRodas = async (req, res) => {
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

    res.status(200).json(rodas);
  } catch (err) {
    console.error("Erro ao listar rodas:", err);
    res.status(400).json({ error: err.message });
  }
};

export const listarRodasMultiplicador = async (req, res) => {
  try {
    const usuarioId = Number(req.userId);

    if (isNaN(usuarioId)) {
      return res.status(400).json({ message: "ID do usuário inválido." });
    }

    const rodas = await prisma.roda.findMany({
      include: {
        faixasEtarias: {
          include: { faixaEtaria: true },
        },
      },
      where: {
        multiplicadorId: usuarioId,
        status: "ativa",
      },
      orderBy: { data: "asc" },
    });

    return res.status(200).json(rodas);
  } catch (error) {
    console.error("Erro ao buscar rodas:", error);
    return res.status(500).json({ message: "Erro ao buscar rodas" });
  }
};

export const listarRodasHistorico = async (req, res) => {
  try {
    const usuarioId = Number(req.userId); // <-- CORRETO

    console.log("=== DEBUG HISTÓRICO ===");
    console.log("usuarioId:", usuarioId);

    if (isNaN(usuarioId)) {
      return res
        .status(400)
        .json({ message: "ID do usuário inválido no token" });
    }

    const rodas = await prisma.roda.findMany({
      where: {
        multiplicadorId: usuarioId,
        status: "finalizada",
      },
      include: {
        faixasEtarias: {
          include: {
            faixaEtaria: true,
          },
        },
      },
      orderBy: {
        data: "desc",
      },
    });

    return res.status(200).json(rodas);
  } catch (error) {
    console.error("Erro ao buscar histórico:", error);
    return res.status(500).json({ message: "Erro ao buscar rodas" });
  }
};

export const encerrarRoda = async (req, res) => {
  try {
    const usuarioId = req.userId;
    const { rodaId, fotoFrequencia, fotoRodaConversa, resumo, faixasEtarias } =
      req.body;
    console.log("=== ENCERRAR RODA ===");
    console.log("Usuario ID:", usuarioId);
    console.log("Roda ID:", rodaId);
    console.log("Faixas Etárias:", faixasEtarias);
    const rodaIdNumber = Number(rodaId);
    if (isNaN(rodaIdNumber)) {
      return res.status(400).json({ message: "ID da roda inválido" });
    }
    if (!Array.isArray(faixasEtarias) || faixasEtarias.length === 0) {
      return res
        .status(400)
        .json({ message: "Selecione pelo menos uma faixa etária" });
    }
    const roda = await prisma.roda.findFirst({
      where: { id: rodaIdNumber, multiplicadorId: usuarioId },
    });
    if (!roda) {
      console.log("Roda não encontrada");
      return res
        .status(403)
        .json({ message: "Você não tem permissão para encerrar esta roda" });
    }
    const rodaEncerrada = await prisma.$transaction(async (tx) => {
      const rodaAtualizada = await tx.roda.update({
        where: { id: rodaIdNumber },
        data: {
          status: "finalizada",
          fotoFrequenciaUrl: fotoFrequencia,
          fotoRodaUrl: fotoRodaConversa,
          resumo: resumo,
        },
      });
      await tx.rodaFaixaEtaria.createMany({
        data: faixasEtarias.map((faixaId) => ({
          rodaId: rodaIdNumber,
          faixaEtariaId: faixaId,
        })),
      });
      return rodaAtualizada;
    });
    console.log("✅ Roda encerrada com sucesso:", rodaEncerrada.id);
    return res.json(rodaEncerrada);
  } catch (error) {
    console.error("❌ ERRO AO ENCERRAR RODA:", error);
    console.error("Mensagem:", error.message);
    return res
      .status(500)
      .json({ message: "Erro ao encerrar roda", error: error.message });
  }
};

export const estatisticas = async (req, res) => {
  try {
    const usuarioId = req.userId; // ⚠️ CORRETO: use userId

    console.log("=== BUSCANDO ESTATÍSTICAS ===");
    console.log("Usuario ID:", usuarioId);

    // Buscar rodas finalizadas do multiplicador
    const rodas = await prisma.roda.findMany({
      where: {
        multiplicadorId: usuarioId,
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

    console.log("Rodas encontradas:", rodas.length);

    if (rodas.length > 0) {
      console.log("Primeira roda:", {
        id: rodas[0].id,
        tema: rodas[0].tema,
        status: rodas[0].status,
        faixasEtarias: rodas[0].faixasEtarias,
      });
    }

    // Processar dados por município
    const municipios = {};
    rodas.forEach((roda) => {
      const municipio = roda.municipio || "Não informado";
      municipios[municipio] = (municipios[municipio] || 0) + 1;
    });

    // Processar dados por faixa etária
    const faixasEtarias = {};
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

    console.log("Resultado:", resultado);

    return res.json(resultado);
  } catch (error) {
    console.error("❌ Erro ao buscar estatísticas:", error);
    console.error("Mensagem:", error.message);
    return res.status(500).json({
      message: "Erro ao buscar estatísticas",
      error: error.message,
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

    if (
      !tema ||
      !data ||
      !hora_inicio ||
      !municipio ||
      !local ||
      !publico_alvo
    ) {
      return res.status(400).json({
        error:
          "Campos obrigatórios: tema, data, hora_inicio, municipio, local, publico_alvo",
      });
    }

    if (!req.userId) {
      return res.status(401).json({ error: "Usuário não autenticado" });
    }

    let coords = { latitude: null, longitude: null };

    const coordenadasPadrao = {
      Fortaleza: { latitude: -3.7172, longitude: -38.5433 },
      Sobral: { latitude: -3.6861, longitude: -40.35 },
      "Juazeiro do Norte": { latitude: -7.2131, longitude: -39.3151 },
      Acaraú: { latitude: -2.8858, longitude: -40.12 },
    };

    if (!latitude || !longitude) {
      const geoData = await buscarCoordenadas(local, municipio);

      if (geoData) {
        coords = {
          latitude: geoData.latitude,
          longitude: geoData.longitude,
        };
      } else {
        coords = coordenadasPadrao[municipio] || {
          latitude: null,
          longitude: null,
        };
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

    // ========== FIM DA CORREÇÃO DE FUSO ==========

    const novaRoda = await prisma.roda.create({
      data: {
        multiplicadorId: req.userId,
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

    console.log("✅ Roda criada com sucesso! ID:", novaRoda.id);
    res.status(201).json(novaRoda);
  } catch (err) {
    console.error("❌ Erro ao criar roda:", err);

    if (err.code === "P2002") {
      return res
        .status(400)
        .json({ error: "Já existe uma roda com esses dados" });
    }

    if (err.code === "P2003") {
      return res.status(400).json({ error: "Multiplicador não encontrado" });
    }

    res.status(400).json({
      error: err.message,
      code: err.code || "UNKNOWN",
    });
  }
};
