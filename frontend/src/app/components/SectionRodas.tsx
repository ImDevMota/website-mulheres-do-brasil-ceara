import { useState, useEffect } from "react";
import { Clock, MapPin, Users, Calendar, X } from "lucide-react";
import { listarRodasMultiplicador, encerrarRoda } from "../services/rodas";
import Carousel from "./Carousel";

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
  const [idadesSelecionadas, setIdadesSelecionadas] = useState<number[]>([]);

  // Opções de idade predefinidas
  const opcoesIdade = [
    { valor: 1, label: "0-12 anos (Crianças)" },
    { valor: 2, label: "13-17 anos (Adolescentes)" },
    { valor: 3, label: "18-29 anos (Jovens)" },
    { valor: 4, label: "30-59 anos (Adultos)" },
    { valor: 5, label: "60+ anos (Idosos)" },
  ];

  useEffect(() => {
    carregarRodas();
  }, []);

  async function carregarRodas() {
    try {
      setLoading(true);
      setError(null);

      // A API retorna apenas as rodas do multiplicador autenticado
      // O backend verifica o token JWT e filtra automaticamente
      const dados = await listarRodasMultiplicador();

      // Não precisa mais filtrar aqui, o backend já retorna apenas rodas ativas do usuário
      setRodas(dados);
    } catch (err) {
      setError("Erro ao carregar as rodas. Tente novamente.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function formatarData(data: string): string {
    if (!data) return "";
    const dateObj = new Date(data);
    const dia = String(dateObj.getUTCDate()).padStart(2, "0");
    const mes = String(dateObj.getUTCMonth() + 1).padStart(2, "0");
    const ano = dateObj.getUTCFullYear();
    return `${dia}/${mes}/${ano}`;
  }

  function formatarHorario(horario: string): string {
    // Converte o horário UTC para o horário local do navegador
    if (horario.includes("T")) {
      const dataHora = new Date(horario);
      const horas = dataHora.getHours().toString().padStart(2, "0");
      const minutos = dataHora.getMinutes().toString().padStart(2, "0");
      return `${horas}:${minutos}`;
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
    setIdadesSelecionadas([]);
  }

  function fecharModal() {
    setModalAberto(false);
    setRodaSelecionada(null);
    setFotoFrequencia(null);
    setFotoRodaConversa(null);
    setResumo("");
    setIdadesSelecionadas([]);
  }

  function toggleIdade(valor: number) {
    setIdadesSelecionadas((prev) => {
      if (prev.includes(valor)) {
        return prev.filter((id) => id !== valor);
      } else {
        return [...prev, valor];
      }
    });
  }

  async function comprimirImagem(
    file: File,
    maxWidth = 1200,
    quality = 0.7
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;

        img.onload = () => {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;

          // Redimensiona se a imagem for maior que maxWidth
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext("2d");
          if (!ctx) {
            reject(new Error("Não foi possível criar contexto do canvas"));
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);

          // Converte para JPEG com compressão
          const compressedBase64 = canvas.toDataURL("image/jpeg", quality);
          resolve(compressedBase64);
        };

        img.onerror = () => reject(new Error("Erro ao carregar imagem"));
      };

      reader.onerror = () => reject(new Error("Erro ao ler arquivo"));
    });
  }

  async function handleEncerrarRoda(e: React.FormEvent) {
    e.preventDefault();

    if (!rodaSelecionada || !fotoFrequencia || !fotoRodaConversa) {
      alert("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    if (idadesSelecionadas.length === 0) {
      alert("Por favor, selecione pelo menos uma faixa etária");
      return;
    }

    try {
      setLoadingEncerrar(true);

      // Comprime as imagens antes de enviar (reduz o tamanho)
      const foto1Comprimida = await comprimirImagem(fotoFrequencia);
      const foto2Comprimida = await comprimirImagem(fotoRodaConversa);

      // Chama a função com objeto (Opção 2)
      await encerrarRoda({
        rodaId: rodaSelecionada.id,
        fotoFrequencia: foto1Comprimida,
        fotoRodaConversa: foto2Comprimida,
        faixasEtarias: idadesSelecionadas,
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

  if (error) {
    return (
      <section className="py-12 px-4 bg-gray-50">
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
    <>
      <Carousel
        title="Rodas Ativas"
        items={rodas}
        loading={loading}
        onRefresh={carregarRodas}
        emptyMessage="Você não possui rodas ativas no momento."
        renderItem={(roda) => (
          <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col h-full">
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
            </div>

            <div className="px-6 pb-6 mt-auto">
              <button
                onClick={() => abrirModal(roda)}
                className="w-full bg-[#e91e63] text-white py-2 rounded-lg hover:bg-[#c2185b] transition font-semibold"
              >
                Finalizar Roda
              </button>
            </div>
          </div>
        )}
      />

      {/* Modal de Finalizar Roda */}
      {modalAberto && rodaSelecionada && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header do Modal */}
            <div className="sticky top-0 bg-[#e91e63] text-white p-6 flex justify-between items-center rounded-t-lg">
              <div>
                <h3 className="text-2xl font-bold">Finalizar Roda</h3>
                <p className="text-blue-100 mt-1">{rodaSelecionada.tema}</p>
              </div>
              <button
                onClick={fecharModal}
                className="text-white hover:bg-[#c2185b] p-2 rounded-lg transition"
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
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#fce4ec] file:text-[#e91e63] hover:file:bg-[#f8bbd9] cursor-pointer"
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
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#fce4ec] file:text-[#e91e63] hover:file:bg-[#f8bbd9] cursor-pointer"
                />
                {fotoRodaConversa && (
                  <p className="text-sm text-green-600 mt-2">
                    ✓ {fotoRodaConversa.name}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Faixas Etárias do Público{" "}
                  <span className="text-red-500">*</span>
                </label>
                <div className="space-y-2">
                  {opcoesIdade.map((opcao) => (
                    <label
                      key={opcao.valor}
                      className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition"
                    >
                      <input
                        type="checkbox"
                        checked={idadesSelecionadas.includes(opcao.valor)}
                        onChange={() => toggleIdade(opcao.valor)}
                        className="w-5 h-5 text-[#e91e63] border-gray-300 rounded focus:ring-[#e91e63] cursor-pointer"
                      />
                      <span className="ml-3 text-gray-700">{opcao.label}</span>
                    </label>
                  ))}
                </div>
                {idadesSelecionadas.length > 0 && (
                  <p className="text-sm text-green-600 mt-2">
                    ✓ {idadesSelecionadas.length} faixa(s) selecionada(s)
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
                  className="flex-1 bg-[#e91e63] text-white py-3 rounded-lg hover:bg-[#c2185b] transition font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {loadingEncerrar ? "Finalizando..." : "Finalizar Roda"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
