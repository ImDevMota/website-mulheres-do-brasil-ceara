import api from "./api";

export async function listarRodas() {
  const response = await api.get("/rodas");
  return response.data;
}

export async function listarRodasMultiplicador() {
  const response = await api.get("/rodas/multiplicador");
  return response.data;
}

export async function criarRoda(data: {
  tema: string;
  data: string;
  hora_inicio: string;
  municipio: string;
  local: string;
  publico_alvo: string;
  latitude?: number;
  longitude?: number;
}) {
  const response = await api.post("/rodas", data);
  return response.data;
}

export async function encerrarRoda(data: {
  rodaId: number;
  fotoFrequencia: string;
  fotoRodaConversa: string;
  resumo: string;
}) {
  const response = await api.post("/rodas/encerrar", {
    rodaId: data.rodaId,
    fotoFrequencia: data.fotoFrequencia,
    fotoRodaConversa: data.fotoRodaConversa,
    resumo: data.resumo,
  });

  return response.data;
}
