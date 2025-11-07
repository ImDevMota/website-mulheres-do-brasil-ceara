import prisma from "../config/prisma.js";

export const criarRoda = async (req, res) => {
  try {
    const { tema, data, hora_inicio, municipio, local, publico_alvo } =
      req.body;
    const novaRoda = await prisma.rodaConversa.create({
      data: {
        user_id: req.userId,
        tema,
        data: new Date(data),
        hora_inicio: new Date(hora_inicio),
        municipio,
        local,
        publico_alvo,
      },
    });
    res.status(201).json(novaRoda);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
