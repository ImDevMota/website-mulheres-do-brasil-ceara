import { useState, useEffect } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import { obterEstatisticas } from "../services/rodas";

// Registrar componentes do Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

interface Estatisticas {
  totalRodas: number;
  municipios: { [key: string]: number };
  faixasEtarias: { [key: string]: number };
  municipiosCount: number;
  faixasEtariasCount: number;
}

export default function SectionGrafico() {
  const [estatisticas, setEstatisticas] = useState<Estatisticas | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    try {
      setLoading(true);
      setError(null);

      console.log("📊 Carregando estatísticas...");

      const response = await obterEstatisticas();

      console.log("=== DEBUG: RESPOSTA COMPLETA ===");
      console.log("response:", response);
      console.log("response.data:", response?.data);
      console.log("response.data?.data:", response?.data?.data);

      // ✅ CORRIGIDO: A resposta pode ser response ou response.data
      const dados = response?.data?.data || response?.data || response;

      console.log("Dados extraídos:", dados);
      console.log("totalRodas:", dados?.totalRodas);
      console.log("municipios:", dados?.municipios);
      console.log("faixasEtarias:", dados?.faixasEtarias);

      // Validar se os dados têm a estrutura esperada
      if (!dados || typeof dados !== "object") {
        throw new Error("Formato de resposta inválido");
      }

      setEstatisticas(dados as Estatisticas);

      console.log("✅ Estado atualizado com sucesso");
    } catch (err) {
      console.error("❌ Erro completo:", err);
      if (err instanceof Error) {
        console.error("Mensagem:", err.message);
        console.error("Stack:", err.stack);
      }
      setError("Erro ao carregar dados do dashboard. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  // Estado de carregamento
  if (loading) {
    return (
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">Dashboard</h2>
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e91e63]"></div>
          </div>
        </div>
      </section>
    );
  }

  // Estado de erro
  if (error) {
    return (
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">Dashboard</h2>
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={carregarDados}
              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition"
            >
              Tentar novamente
            </button>
          </div>
        </div>
      </section>
    );
  }

  // Estado nulo
  if (!estatisticas) {
    return (
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">Dashboard</h2>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <p className="text-yellow-600">
              Estatísticas não carregadas. Verifique o console.
            </p>
          </div>
        </div>
      </section>
    );
  }

  // Estado vazio
  if (estatisticas.totalRodas === 0) {
    return (
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">Dashboard</h2>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <p className="text-blue-600 mb-4">
              ℹ️ Nenhuma roda finalizada ainda.
            </p>
            <p className="text-blue-500 text-sm">
              Finalize sua primeira roda para ver as estatísticas aqui.
            </p>
          </div>
        </div>
      </section>
    );
  }

  // Verificar dados
  const temMunicipios = Object.keys(estatisticas.municipios).length > 0;
  const temFaixasEtarias = Object.keys(estatisticas.faixasEtarias).length > 0;

  // Gráfico de municípios
  const graficoMunicipios = {
    labels: Object.keys(estatisticas.municipios),
    datasets: [
      {
        label: "Rodas por Município",
        data: Object.values(estatisticas.municipios),
        backgroundColor: [
          "#880e4f",
          "#ad1457",
          "#c2185b",
          "#d81b60",
          "#e91e63",
          "#ec407a",
          "#f48fb1",
        ],
        borderColor: "#ffffff",
        borderWidth: 2,
      },
    ],
  };

  // Gráfico de faixa etária
  const graficoFaixaEtaria = {
    labels: Object.keys(estatisticas.faixasEtarias),
    datasets: [
      {
        label: "Rodas por Faixa Etária",
        data: Object.values(estatisticas.faixasEtarias),
        backgroundColor: [
          "#e91e63",
          "#ec407a",
          "#f48fb1",
          "#f8bbd9",
          "#fce4ec",
        ],
        borderColor: "#ffffff",
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          padding: 15,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            const label = context.label || "";
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce(
              (a: number, b: number) => a + b,
              0
            );
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <section className="py-12 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">Dashboard</h2>
            <p className="text-gray-600 mt-1">
              Visão geral das suas rodas de conversa
            </p>
          </div>
          <button
            onClick={carregarDados}
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

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-gray-500 text-sm font-medium mb-2">
              Total de Rodas Finalizadas
            </h3>
            <p className="text-3xl font-bold text-[#e91e63]">
              {estatisticas.totalRodas}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-gray-500 text-sm font-medium mb-2">
              Municípios Atendidos
            </h3>
            <p className="text-3xl font-bold text-[#e91e63]">
              {estatisticas.municipiosCount}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-gray-500 text-sm font-medium mb-2">
              Faixas Etárias
            </h3>
            <p className="text-3xl font-bold text-[#e91e63]">
              {estatisticas.faixasEtariasCount}
            </p>
          </div>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Distribuição por Município
            </h3>
            {temMunicipios ? (
              <div className="h-80">
                <Pie data={graficoMunicipios} options={chartOptions} />
              </div>
            ) : (
              <p className="text-gray-500 text-center py-20">
                Sem dados de municípios
              </p>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Distribuição por Faixa Etária
            </h3>
            {temFaixasEtarias ? (
              <div className="h-80">
                <Pie data={graficoFaixaEtaria} options={chartOptions} />
              </div>
            ) : (
              <p className="text-gray-500 text-center py-20">
                Sem dados de faixas etárias
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
