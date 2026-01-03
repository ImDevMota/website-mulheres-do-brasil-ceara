"use client";

import { useState } from "react";
import { criarRoda } from "../services/rodas";
import { X } from "lucide-react";

interface ModalNovaRodaProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface RodaFormData {
  tema: string;
  data: string;
  hora_inicio: string;
  municipio: string;
  local: string;
  publico_alvo: string;
}

export default function ModalNovaRoda({
  isOpen,
  onClose,
  onSuccess,
}: ModalNovaRodaProps) {
  const [formData, setFormData] = useState<RodaFormData>({
    tema: "",
    data: "",
    hora_inicio: "",
    municipio: "",
    local: "",
    publico_alvo: "",
  });

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const now = new Date();
      // YYYY-MM-DD
      const dia = String(now.getDate()).padStart(2, "0");
      const mes = String(now.getMonth() + 1).padStart(2, "0"); // Mês começa em 0
      const ano = now.getFullYear();
      const dataFormatada = `${ano}-${mes}-${dia}`;

      // HH:mm
      const horas = String(now.getHours()).padStart(2, "0");
      const minutos = String(now.getMinutes()).padStart(2, "0");
      const horaFormatada = `${horas}:${minutos}`;

      const dadosParaEnviar = {
        ...formData,
        data: dataFormatada,
        hora_inicio: horaFormatada,
      };

      await criarRoda(dadosParaEnviar);
      console.log("Roda criada com sucesso!");
      // Reset form
      setFormData({
        tema: "",
        data: "",
        hora_inicio: "",
        municipio: "",
        local: "",
        publico_alvo: "",
      });
      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      console.error(err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="bg-[#e91e63] p-6 flex justify-between items-center text-white">
          <h2 className="text-2xl font-bold">Nova Roda de Conversa</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-8 max-h-[80vh] overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Tema */}
            <div className="flex flex-col w-full relative">
              <input
                type="text"
                name="tema"
                value={formData.tema}
                onChange={handleChange}
                className="border-2 text-gray-800 border-gray-200 rounded-xl px-4 h-12 w-full focus:outline-none focus:border-[#e91e63] focus:ring-2 focus:ring-[#fce4ec] transition-all"
                placeholder="Tema da Roda"
                required
              />
              <label className="absolute left-3 -top-2.5 px-1 bg-white text-[#e91e63] text-sm font-semibold">
                Tema
              </label>
            </div>

            {/* Município */}
            <div className="flex flex-col w-full relative">
              <select
                name="municipio"
                value={formData.municipio}
                onChange={handleChange}
                className="border-2 border-gray-200 rounded-xl px-4 pr-8 h-12 w-full text-gray-800 appearance-none focus:outline-none focus:border-[#e91e63] focus:ring-2 focus:ring-[#fce4ec] transition-all"
                required
              >
                <option value="">Selecione o município</option>
                <option value="Fortaleza">Fortaleza</option>
                <option value="Sobral">Sobral</option>
                <option value="Juazeiro do Norte">Juazeiro do Norte</option>
                <option value="Acaraú">Acaraú</option>
                <option value="Itapipoca">Itapipoca</option>
                <option value="Quixadá">Quixadá</option>
                <option value="Iguatu">Iguatu</option>
                <option value="Crateús">Crateús</option>
                <option value="Aracati">Aracati</option>
                <option value="Tianguá">Tianguá</option>
                <option value="Tauá">Tauá</option>
                <option value="Limoeiro do Norte">Limoeiro do Norte</option>
                <option value="Canindé">Canindé</option>
                <option value="Camocim">Camocim</option>
              </select>
              <label className="absolute left-3 -top-2.5 px-1 bg-white text-[#e91e63] text-sm font-semibold">
                Município
              </label>
            </div>

            {/* Local */}
            <div className="flex flex-col w-full relative">
              <input
                type="text"
                name="local"
                value={formData.local}
                onChange={handleChange}
                className="border-2 text-gray-800 border-gray-200 rounded-xl px-4 h-12 w-full focus:outline-none focus:border-[#e91e63] focus:ring-2 focus:ring-[#fce4ec] transition-all"
                placeholder="Endereço do local"
                required
              />
              <label className="absolute left-3 -top-2.5 px-1 bg-white text-[#e91e63] text-sm font-semibold">
                Local
              </label>
            </div>

            {/* Público Alvo */}
            <div className="flex flex-col w-full relative">
              <input
                type="text"
                name="publico_alvo"
                value={formData.publico_alvo}
                onChange={handleChange}
                className="border-2 text-gray-800 border-gray-200 rounded-xl px-4 h-12 w-full focus:outline-none focus:border-[#e91e63] focus:ring-2 focus:ring-[#fce4ec] transition-all"
                placeholder="Ex: Jovens, Mulheres, etc."
                required
              />
              <label className="absolute left-3 -top-2.5 px-1 bg-white text-[#e91e63] text-sm font-semibold">
                Público alvo
              </label>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-[#e91e63] hover:bg-[#c2185b] text-white py-3 h-12 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                Criar Roda
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
