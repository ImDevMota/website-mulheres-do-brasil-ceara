"use client";

import dynamic from "next/dynamic";
import Header from "../components/Header";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import { register } from "../services/auth";
import { criarRoda } from "../services/rodas";
import SectionRodas from "../components/SectionRodas";

interface RodaFormData {
  tema: string;
  data: string;
  hora_inicio: string;
  municipio: string;
  local: string;
  publico_alvo: string;
  latitude?: number;
  longitude?: number;
}

export default function Page() {
  const [formData, setFormData] = useState<RodaFormData>({
    tema: "",
    data: "",
    hora_inicio: "",
    municipio: "",
    local: "",
    publico_alvo: "",
  });

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
  }, []);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    console.log("📤 Dados que serão enviados:", formData);
    console.log("📤 Token:", localStorage.getItem("token"));

    try {
      await criarRoda(formData);
      toast.success("Roda criada com sucesso!");
      router.push("/"); // Redireciona após criar
    } catch (err) {
      console.error(err);
      toast.error("Erro ao criar roda");
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen w-screen bg-gray-100 font-poppins">
      <Header />

      <SectionRodas />

      <div className="flex flex-col mt-[7rem] items-center justify-center w-[90%] sm:w-[30%] bg-white rounded-2xl px-[2.7rem] py-[1.5rem]">
        <h1 className="text-[30px] text-black/80 text-center font-[600]">
          Nova Roda de Conversas:
        </h1>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center justify-center w-[100%] gap-y-[1rem] mt-[1rem]"
        >
          {/* Tema */}
          <div className="flex flex-col w-full relative">
            <input
              type="text"
              name="tema"
              onChange={handleChange}
              className="border-[2px] text-black/80 peer border-gray-300 rounded-[4px] px-[0.8rem] h-[2.7rem] py-[0.4rem] w-full focus:outline-none focus:border-blue-500"
              placeholder="Tema da Roda"
              id="tema"
              required
            />
            <label
              className="absolute left-3 top-[-10px] px-1 bg-white text-blue-500 font-[600] text-sm opacity-0 peer-focus:opacity-100 transition"
              htmlFor="tema"
            >
              Tema
            </label>
          </div>

          {/* Data */}
          <div className="flex flex-col w-full relative">
            <input
              type="date"
              name="data"
              onChange={handleChange}
              className="border-[2px] text-black/80 peer border-gray-300 rounded-[4px] px-[0.8rem] h-[2.7rem] py-[0.4rem] w-full focus:outline-none focus:border-blue-500"
              id="data"
              required
            />
            <label
              className="absolute left-3 top-[-10px] px-1 bg-white text-blue-500 font-[600] text-sm opacity-0 peer-focus:opacity-100 transition"
              htmlFor="data"
            >
              Data
            </label>
          </div>

          {/* Hora Início */}
          <div className="flex flex-col w-full relative">
            <input
              type="time"
              name="hora_inicio"
              onChange={handleChange}
              className="border-[2px] text-black/80 peer border-gray-300 rounded-[4px] px-[0.8rem] h-[2.7rem] py-[0.4rem] w-full focus:outline-none focus:border-blue-500"
              id="hora_inicio"
              required
            />
            <label
              className="absolute left-3 top-[-10px] px-1 bg-white text-blue-500 font-[600] text-sm opacity-0 peer-focus:opacity-100 transition"
              htmlFor="hora_inicio"
            >
              Hora de Início
            </label>
          </div>

          {/* Município */}
          <div className="flex flex-col w-full relative">
            <select
              name="municipio"
              onChange={handleChange}
              className="border-[2px] border-gray-300 rounded-[4px] px-[0.8rem] pr-[2rem] h-[2.7rem] py-[0.4rem] w-full text-black/80 appearance-none focus:outline-none focus:border-blue-500"
              id="municipio"
              required
            >
              <option value="">Selecione o município</option>
              <option value="Fortaleza">Fortaleza</option>
              <option value="Sobral">Sobral</option>
              <option value="Juazeiro do Norte">Juazeiro do Norte</option>
              <option value="Acaraú">Acaraú</option>
            </select>
            <svg
              className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-500"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.25 8.29a.75.75 0 01-.02-1.08z"
                clipRule="evenodd"
              />
            </svg>
          </div>

          {/* Local */}
          <div className="flex flex-col w-full relative">
            <input
              type="text"
              name="local"
              onChange={handleChange}
              className="border-[2px] text-black/80 peer border-gray-300 rounded-[4px] px-[0.8rem] h-[2.7rem] py-[0.4rem] w-full focus:outline-none focus:border-blue-500"
              placeholder="Endereço do local"
              id="local"
              required
            />
            <label
              className="absolute left-3 top-[-10px] px-1 bg-white text-blue-500 font-[600] text-sm opacity-0 peer-focus:opacity-100 transition"
              htmlFor="local"
            >
              Local
            </label>
          </div>

          {/* Público Alvo */}
          <div className="flex flex-col w-full relative">
            <input
              type="text"
              name="publico_alvo"
              onChange={handleChange}
              className="border-[2px] text-black/80 peer border-gray-300 rounded-[4px] px-[0.8rem] py-[0.4rem] h-[2.7rem] w-full focus:outline-none focus:border-blue-500"
              placeholder="Público alvo"
              id="publico_alvo"
              required
            />
            <label
              className="absolute left-3 top-[-10px] px-1 bg-white text-blue-500 font-[600] text-sm opacity-0 peer-focus:opacity-100 transition"
              htmlFor="publico_alvo"
            >
              Público alvo
            </label>
          </div>

          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 transition-all duration-[0.5s] w-full py-[0.545rem] h-[2.7rem] mt-[0.4rem] text-[14px] font-[600] tracking-[0.5px] rounded-[4px] text-white"
          >
            Criar Roda
          </button>
        </form>
      </div>
    </div>
  );
}
