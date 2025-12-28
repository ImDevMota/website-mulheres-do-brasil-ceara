import api from "./api";

export async function listarRodas() {
  const response = await api.get("/rodas");
  return response.data;
}

export async function listarRodasHistorico() {
  const response = await api.get("/rodas/historico");
  return response.data;
}

export async function obterEstatisticas() {
  const response = await api.get("/rodas/estatisticas");
  return response.data;
}

export async function listarRodasMultiplicador() {
  const response = await api.get("/rodas/me");
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
  faixasEtarias: number[];
  resumo: string;
}) {
  const response = await api.post(`/rodas/${data.rodaId}/encerrar`, {
    fotoFrequencia: data.fotoFrequencia,
    fotoRodaConversa: data.fotoRodaConversa,
    faixasEtarias: data.faixasEtarias,
    resumo: data.resumo,
  });

  return response.data;
}
