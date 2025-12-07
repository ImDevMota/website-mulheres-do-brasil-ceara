import { useState, useEffect } from "react";
import {
  Clock,
  MapPin,
  Users,
  Calendar,
  FileText,
  Image,
  X,
} from "lucide-react";
import { listarRodasHistorico } from "../services/rodas";

interface RodaFinalizada {
  id: number;
  tema: string;
  data: string;
  hora_inicio: string;
  municipio: string;
  local: string;
  publico_alvo: string;
  status: string;
  resumo: string;

  faixasEtarias: {
    faixaEtaria: {
      id: number;
      nome: string;
      descricao: string;
    };
  }[];

  fotoFrequenciaUrl: string;
  fotoRodaUrl: string;
  latitude?: number;
  longitude?: number;
}

export default function SectionHistoricoRodas() {
  const [rodas, setRodas] = useState<RodaFinalizada[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [rodaSelecionada, setRodaSelecionada] = useState<RodaFinalizada | null>(
    null
  );

  useEffect(() => {
    carregarRodas();
  }, []);

  async function carregarRodas() {
    try {
      setLoading(true);
      setError(null);

      const dados = await listarRodasHistorico();

      // 🔥 Normaliza para garantir que sempre exista faixasEtarias
      const rodasNormalizadas = dados.map((r: any) => ({
        ...r,
        faixasEtarias: r.faixasEtarias ?? [],
      }));

      setRodas(rodasNormalizadas);
    } catch (err) {
      setError("Erro ao carregar o histórico. Tente novamente.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function formatarData(data: string): string {
    const dataLimpa = data.split("T")[0];
    const [ano, mes, dia] = dataLimpa.split("-");
    return `${dia}/${mes}/${ano}`;
  }

  function formatarHorario(horario: string): string {
    // Converte o horário UTC para horário local
    if (horario.includes("T")) {
      const dataHora = new Date(horario);
      const horas = dataHora.getHours().toString().padStart(2, "0");
      const minutos = dataHora.getMinutes().toString().padStart(2, "0");
      return `${horas}:${minutos}`;
    }
    return horario.substring(0, 5);
  }

  function abrirDetalhes(roda: RodaFinalizada) {
    setRodaSelecionada(roda);
    setModalAberto(true);
  }

  function fecharModal() {
    setModalAberto(false);
    setRodaSelecionada(null);
  }

  if (loading) {
    return (
      <section className="py-12 px-4 ">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            Histórico de Rodas
          </h2>
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e91e63]"></div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-12 px-4 ">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            Histórico de Rodas
          </h2>
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={carregarRodas}
              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition"
            >
              Tentar novamente
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 px-4 ">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">
            Histórico de Rodas
          </h2>
          <button
            onClick={carregarRodas}
            className="bg-[#e91e63] text-white px-4 py-2 rounded-lg hover:bg-[#c2185b] transition flex items-center gap-2"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Atualizar
          </button>
        </div>

        {rodas.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-500 text-lg">
              Você ainda não finalizou nenhuma roda.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rodas.map((roda) => (
              <div
                key={roda.id}
                className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col h-full"
              >
                <div className="bg-[#e91e63] p-4 min-h-[80px] flex items-center">
                  <h3 className="text-xl font-bold text-white line-clamp-2">
                    {roda.tema}
                  </h3>
                </div>

                <div className="p-6 space-y-4 flex-grow">
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-[#e91e63] mt-0.5 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm text-gray-500">Data</p>
                      <p className="font-semibold text-gray-800">
                        {formatarData(roda.data)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-[#e91e63] mt-0.5 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm text-gray-500">Horário</p>
                      <p className="font-semibold text-gray-800">
                        {formatarHorario(roda.hora_inicio)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-[#e91e63] mt-0.5 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm text-gray-500">Local</p>
                      <p className="font-semibold text-gray-800 line-clamp-2">
                        {roda.local}
                      </p>
                      <p className="text-sm text-gray-600">{roda.municipio}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Users className="w-5 h-5 text-[#e91e63] mt-0.5 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm text-gray-500">Público-alvo</p>
                      <p className="font-semibold text-gray-800 line-clamp-1">
                        {roda.publico_alvo}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Users className="w-5 h-5 text-[#e91e63] mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500 font-medium">
                        Faixas Etárias
                      </p>

                      {roda.faixasEtarias?.length > 0 ? (
                        <p className="text-gray-800 font-semibold">
                          {roda.faixasEtarias
                            .map((f) => f.faixaEtaria.nome)
                            .join(", ")}
                        </p>
                      ) : (
                        <p className="text-gray-500 italic">
                          Nenhuma registrada
                        </p>
                      )}
                    </div>
                  </div>

                  {roda.resumo && (
                    <div className="flex items-start gap-3">
                      <FileText className="w-5 h-5 text-[#e91e63] mt-0.5 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm text-gray-500">Resumo</p>
                        <p className="text-sm text-gray-700 line-clamp-3">
                          {roda.resumo}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="px-6 pb-6 mt-auto">
                  <button
                    onClick={() => abrirDetalhes(roda)}
                    className="w-full bg-[#e91e63] text-white py-2 rounded-lg hover:bg-[#c2185b] transition font-semibold"
                  >
                    Ver Detalhes
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL */}
      {modalAberto && rodaSelecionada && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-[#e91e63] text-white p-6 flex justify-between items-center rounded-t-lg">
              <div>
                <h3 className="text-2xl font-bold">Detalhes da Roda</h3>
                <p className="text-blue-100 mt-1">{rodaSelecionada.tema}</p>
              </div>
              <button
                onClick={fecharModal}
                className="text-white hover:bg-[#c2185b] p-2 rounded-lg transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-[#e91e63] mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Data</p>
                    <p className="text-gray-800 font-semibold">
                      {formatarData(rodaSelecionada.data)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-[#e91e63] mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Horário</p>
                    <p className="text-gray-800 font-semibold">
                      {formatarHorario(rodaSelecionada.hora_inicio)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#e91e63] mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Local</p>
                    <p className="text-gray-800 font-semibold">
                      {rodaSelecionada.local}
                    </p>
                    <p className="text-sm text-gray-600">
                      {rodaSelecionada.municipio}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-[#e91e63] mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500 font-medium">
                      Público-alvo
                    </p>
                    <p className="text-gray-800 font-semibold">
                      {rodaSelecionada.publico_alvo}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-[#e91e63] mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500 font-medium">
                      Faixas Etárias
                    </p>
                    <p className="text-gray-800 font-semibold">
                      {rodaSelecionada.faixasEtarias
                        ?.map((f) => f.faixaEtaria.nome)
                        .join(", ") || "—"}
                    </p>
                  </div>
                </div>
              </div>

              {rodaSelecionada.resumo && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <FileText className="w-5 h-5 text-[#e91e63]" />
                    <h4 className="text-lg font-bold text-gray-800">
                      Resumo da Roda
                    </h4>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 max-h-60 overflow-y-auto">
                    <p className="text-gray-700 whitespace-pre-wrap break-words">
                      {rodaSelecionada.resumo}
                    </p>
                  </div>
                </div>
              )}

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Image className="w-5 h-5 text-[#e91e63]" />
                  <h4 className="text-lg font-bold text-gray-800">
                    Registros Fotográficos
                  </h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {rodaSelecionada.fotoFrequenciaUrl && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">
                        Foto da Frequência
                      </p>
                      <img
                        src={rodaSelecionada.fotoFrequenciaUrl}
                        alt="Foto da Frequência"
                        className="w-full h-64 object-cover rounded-lg shadow-md hover:shadow-xl transition"
                      />
                    </div>
                  )}

                  {rodaSelecionada.fotoRodaUrl && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">
                        Foto da Roda de Conversa
                      </p>
                      <img
                        src={rodaSelecionada.fotoRodaUrl}
                        alt="Foto da Roda de Conversa"
                        className="w-full h-64 object-cover rounded-lg shadow-md hover:shadow-xl transition"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={fecharModal}
                  className="w-full bg-[#e91e63] text-white py-3 rounded-lg hover:bg-[#c2185b] transition font-semibold"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
