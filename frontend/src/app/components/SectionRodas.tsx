import { useState, useEffect } from "react";
import { Clock, MapPin, Users, Calendar, X } from "lucide-react";
import { listarRodasMultiplicador, encerrarRoda } from "../services/rodas";

interface Roda {
  id: number;
  tema: string;
  data: string;
  hora_inicio: string;
  municipio: string;
  local: string;
  publico_alvo: string;
  status: string;
  latitude?: number;
  longitude?: number;
}

export default function SectionRodas() {
  const [rodas, setRodas] = useState<Roda[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [rodaSelecionada, setRodaSelecionada] = useState<Roda | null>(null);
  const [loadingEncerrar, setLoadingEncerrar] = useState(false);

  // Estados do formulário
  const [fotoFrequencia, setFotoFrequencia] = useState<File | null>(null);
  const [fotoRodaConversa, setFotoRodaConversa] = useState<File | null>(null);
  const [resumo, setResumo] = useState("");

  useEffect(() => {
    carregarRodas();
  }, []);

  async function carregarRodas() {
    try {
      setLoading(true);
      setError(null);

      // A API já retorna apenas as rodas do usuário autenticado
      // O backend verifica o token JWT e filtra automaticamente
      const dados = await listarRodasMultiplicador();

      setRodas(dados);
    } catch (err) {
      setError("Erro ao carregar as rodas. Tente novamente.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function formatarData(data: string): string {
    // Remove a parte da hora se existir (formato ISO: 2025-11-27T00:00:00.000Z)
    const dataLimpa = data.split("T")[0];
    const [ano, mes, dia] = dataLimpa.split("-");
    return `${dia}/${mes}/${ano}`;
  }

  function formatarHorario(horario: string): string {
    // Remove a parte da data se existir (formato ISO: 2025-11-27T16:50:00.000Z)
    if (horario.includes("T")) {
      const horaCompleta = horario.split("T")[1];
      // Pega apenas HH:MM
      return horaCompleta.substring(0, 5);
    }
    // Se já estiver no formato HH:MM:SS ou HH:MM, retorna apenas HH:MM
    return horario.substring(0, 5);
  }

  function abrirModal(roda: Roda) {
    setRodaSelecionada(roda);
    setModalAberto(true);
    // Limpa o formulário
    setFotoFrequencia(null);
    setFotoRodaConversa(null);
    setResumo("");
  }

  function fecharModal() {
    setModalAberto(false);
    setRodaSelecionada(null);
    setFotoFrequencia(null);
    setFotoRodaConversa(null);
    setResumo("");
  }

  async function handleEncerrarRoda(e: React.FormEvent) {
    e.preventDefault();

    if (!rodaSelecionada || !fotoFrequencia || !fotoRodaConversa) {
      alert("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    try {
      setLoadingEncerrar(true);

      // Converte arquivos para base64
      const reader1 = new FileReader();
      const reader2 = new FileReader();

      reader1.readAsDataURL(fotoFrequencia);
      reader2.readAsDataURL(fotoRodaConversa);

      const foto1Promise = new Promise<string>((resolve) => {
        reader1.onload = () => resolve(reader1.result as string);
      });

      const foto2Promise = new Promise<string>((resolve) => {
        reader2.onload = () => resolve(reader2.result as string);
      });

      const [foto1Base64, foto2Base64] = await Promise.all([
        foto1Promise,
        foto2Promise,
      ]);

      // Chama a função com objeto (Opção 2)
      await encerrarRoda({
        rodaId: rodaSelecionada.id,
        fotoFrequencia: foto1Base64,
        fotoRodaConversa: foto2Base64,
        resumo,
      });

      alert("Roda encerrada com sucesso!");
      fecharModal();
      carregarRodas(); // Recarrega a lista
    } catch (error) {
      console.error(error);
      alert("Erro ao encerrar roda. Tente novamente.");
    } finally {
      setLoadingEncerrar(false);
    }
  }

  if (loading) {
    return (
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            Rodas Ativas
          </h2>
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            Rodas Ativas
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
    <section className="py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Rodas Ativas</h2>
          <button
            onClick={carregarRodas}
            className="bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition flex items-center gap-2"
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
              Você não possui rodas ativas no momento.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rodas.map((roda) => (
              <div
                key={roda.id}
                className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col h-full"
              >
                <div className="bg-blue-900 p-4 min-h-[80px] flex items-center">
                  <h3 className="text-xl font-bold text-white line-clamp-2">
                    {roda.tema}
                  </h3>
                </div>

                <div className="p-6 space-y-4 flex-grow">
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-blue-900 mt-0.5 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm text-gray-500">Data</p>
                      <p className="font-semibold text-gray-800">
                        {formatarData(roda.data)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-blue-900 mt-0.5 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm text-gray-500">Horário</p>
                      <p className="font-semibold text-gray-800">
                        {formatarHorario(roda.hora_inicio)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-blue-900 mt-0.5 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm text-gray-500">Local</p>
                      <p className="font-semibold text-gray-800 line-clamp-2">
                        {roda.local}
                      </p>
                      <p className="text-sm text-gray-600">{roda.municipio}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Users className="w-5 h-5 text-blue-900 mt-0.5 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm text-gray-500">Público-alvo</p>
                      <p className="font-semibold text-gray-800 line-clamp-1">
                        {roda.publico_alvo}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="px-6 pb-6 mt-auto">
                  <button
                    onClick={() => abrirModal(roda)}
                    className="w-full bg-blue-900 text-white py-2 rounded-lg hover:bg-blue-800 transition font-semibold"
                  >
                    Finalizar Roda
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de Finalizar Roda */}
      {modalAberto && rodaSelecionada && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header do Modal */}
            <div className="sticky top-0 bg-blue-900 text-white p-6 flex justify-between items-center rounded-t-lg">
              <div>
                <h3 className="text-2xl font-bold">Finalizar Roda</h3>
                <p className="text-blue-100 mt-1">{rodaSelecionada.tema}</p>
              </div>
              <button
                onClick={fecharModal}
                className="text-white hover:bg-blue-800 p-2 rounded-lg transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Formulário */}
            <form onSubmit={handleEncerrarRoda} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Foto da Frequência <span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  accept="image/*"
                  required
                  onChange={(e) =>
                    setFotoFrequencia(e.target.files?.[0] || null)
                  }
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-900 hover:file:bg-blue-100 cursor-pointer"
                />
                {fotoFrequencia && (
                  <p className="text-sm text-green-600 mt-2">
                    ✓ {fotoFrequencia.name}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Foto da Roda de Conversa{" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  accept="image/*"
                  required
                  onChange={(e) =>
                    setFotoRodaConversa(e.target.files?.[0] || null)
                  }
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-900 hover:file:bg-blue-100 cursor-pointer"
                />
                {fotoRodaConversa && (
                  <p className="text-sm text-green-600 mt-2">
                    ✓ {fotoRodaConversa.name}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Resumo da Roda <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  value={resumo}
                  onChange={(e) => setResumo(e.target.value)}
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent resize-none"
                  placeholder="Descreva como foi a roda, principais temas discutidos, participação do público, resultados alcançados..."
                />
                <p className="text-sm text-gray-500 mt-2">
                  {resumo.length} caracteres
                </p>
              </div>

              {/* Botões */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={fecharModal}
                  disabled={loadingEncerrar}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition font-semibold disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loadingEncerrar}
                  className="flex-1 bg-blue-900 text-white py-3 rounded-lg hover:bg-blue-800 transition font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {loadingEncerrar ? "Finalizando..." : "Finalizar Roda"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
