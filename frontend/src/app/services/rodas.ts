import api from "./api";

export async function listarRodas() {
  const response = await api.get("/rodas");
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

export async function encerrarRoda(
  fotoFrequencia: string,
  fotoRodaConversa: string,
  resumo: string
) {
  const response = await api.post("/encerrar-roda", {
    fotoFrequencia,
    fotoRodaConversa,
    resumo,
  });

  return response.data;
}
