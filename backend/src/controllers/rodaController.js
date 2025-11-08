import prisma from "../config/prisma.js";
import { buscarCoordenadas } from "../services/geocoding.js";

export const criarRoda = async (req, res) => {
  try {
    const {
      tema,
      data,
      hora_inicio,
      municipio,
      local,
      publico_alvo,
      latitude,
      longitude,
    } = req.body;

    let coords = { latitude, longitude };

    // Se não tiver coordenadas, buscar automaticamente
    if (!latitude || !longitude) {
      const geoData = await buscarCoordenadas(local, municipio);
      if (geoData) {
        coords = {
          latitude: geoData.latitude,
          longitude: geoData.longitude,
        };
        console.log(`✅ Coordenadas encontradas: ${geoData.display_name}`);
      } else {
        console.log(
          "⚠️ Não foi possível encontrar coordenadas para este endereço"
        );
      }
    }

    const novaRoda = await prisma.rodaConversa.create({
      data: {
        user_id: req.userId,
        tema,
        data: new Date(data),
        hora_inicio: new Date(hora_inicio),
        municipio,
        local,
        publico_alvo,
        latitude: coords.latitude,
        longitude: coords.longitude,
      },
    });

    res.status(201).json(novaRoda);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
