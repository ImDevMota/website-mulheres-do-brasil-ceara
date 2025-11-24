"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

import { register } from "../services/auth";
import Header from "../components/Header";

interface RegisterFormData {
  nome: string;
  cpf: string;
  email: string;
  estado: string;
  municipio: string;
  profissao: string;
  telefone: string;
  senha: string;
  confirmarSenha: string;
}

export default function page() {
  const [formData, setFormData] = useState<RegisterFormData>({
    nome: "",
    cpf: "",
    email: "",
    estado: "",
    municipio: "",
    profissao: "",
    telefone: "",
    senha: "",
    confirmarSenha: "",
  });

  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setFormData({ ...formData, [event.target.name]: event.target.value });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (formData.senha !== formData.confirmarSenha) {
      setError("As senhas não coincidem");
      return;
    }

    setError("");

    try {
      await register(
        formData.nome,
        formData.cpf,
        formData.email,
        formData.estado,
        formData.municipio,
        formData.profissao,
        formData.telefone,
        formData.senha
      );

      toast.success("Usuário Cadastrado com Sucesso!");

      router.push("/login");
    } catch (err) {
      toast.error("Erro ao Cadastrar Usuário");
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen w-screen bg-gray-100 font-poppins">
      <Header />
      <div className="flex flex-col mt-[7rem] items-center justify-center w-[90%] sm:w-[30%] bg-white rounded-2xl px-[2.7rem] py-[1.5rem]">
        <h1 className="text-[32px] text-black/80 font-[600]">Cadastro</h1>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center justify-center w-[100%] gap-y-[1rem] mt-[1rem]"
        >
          <div className="flex flex-col w-full relative">
            <input
              type="text"
              name="nome"
              onChange={handleChange}
              className="border-[2px] text-black/80 peer border-gray-300 rounded-[4px] px-[0.8rem] h-[2.7rem] py-[0.4rem] w-full focus:outline-none focus:border-blue-500"
              placeholder="Nome Completo"
              id="nome"
              required
            />

            <label
              className="absolute left-3 top-[-10px] px-1 bg-white text-blue-500 font-[600] text-sm opacity-0 peer-focus:opacity-100 transition"
              htmlFor="nome"
            >
              Nome Completo
            </label>
          </div>

          <div className="flex flex-col w-full relative">
            <input
              type="text"
              name="cpf"
              onChange={handleChange}
              className="border-[2px] text-black/80 peer border-gray-300 rounded-[4px] px-[0.8rem] h-[2.7rem] py-[0.4rem] w-full focus:outline-none focus:border-blue-500"
              placeholder="000.000.000-00"
              id="cpf"
              required
            />

            <label
              className="absolute left-3 top-[-10px] px-1 bg-white text-blue-500 font-[600] text-sm opacity-0 peer-focus:opacity-100 transition"
              htmlFor="cpf"
            >
              CPF
            </label>
          </div>

          <div className="flex flex-col w-full relative">
            <input
              type="email"
              name="email"
              onChange={handleChange}
              className="border-[2px] text-black/80 peer border-gray-300 rounded-[4px] px-[0.8rem] py-[0.4rem] h-[2.7rem] w-full focus:outline-none focus:border-blue-500"
              placeholder="E-mail"
              id="email"
              required
            />

            <label
              className="absolute left-3 top-[-10px] px-1 bg-white text-blue-500 font-[600] text-sm opacity-0 peer-focus:opacity-100 transition"
              htmlFor="email"
            >
              E-mail
            </label>
          </div>

          <div className="flex flex-col w-full relative">
            <input
              type="tel"
              name="telefone"
              onChange={handleChange}
              className="border-[2px] text-black/80 peer border-gray-300 rounded-[4px] px-[0.8rem] py-[0.4rem] h-[2.7rem] w-full focus:outline-none focus:border-blue-500"
              placeholder="(00) 00000-0000"
              id="telefone"
              required
            />

            <label
              className="absolute left-3 top-[-10px] px-1 bg-white text-blue-500 font-[600] text-sm opacity-0 peer-focus:opacity-100 transition"
              htmlFor="telefone"
            >
              Telefone
            </label>
          </div>

          <div className="flex flex-col w-full relative">
            <input
              type="text"
              name="profissao"
              onChange={handleChange}
              className="border-[2px] text-black/80 peer border-gray-300 rounded-[4px] px-[0.8rem] h-[2.7rem] py-[0.4rem] w-full focus:outline-none focus:border-blue-500"
              placeholder="Profissão"
              id="profissao"
              required
            />

            <label
              className="absolute left-3 top-[-10px] px-1 bg-white text-blue-500 font-[600] text-sm opacity-0 peer-focus:opacity-100 transition"
              htmlFor="profissao"
            >
              Profissão
            </label>
          </div>

          <div className="flex flex-col w-full relative">
            <select
              name="estado"
              onChange={(e) => {
                const estado = e.target.value;
                setFormData({ ...formData, estado, municipio: "" }); // atualiza estado
              }}
              className="border-[2px] border-gray-300 rounded-[4px] px-[0.8rem] pr-[2rem] h-[2.7rem] py-[0.4rem] w-full text-black/80 appearance-none focus:outline-none focus:border-blue-500"
              id="estado"
              required
            >
              <option value="">Selecione o Estado</option>
              <option value="CE">Ceará</option>
              <option value="SP">São Paulo</option>
              <option value="RJ">Rio de Janeiro</option>
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

          <div className="flex flex-col w-full relative">
            <select
              name="municipio"
              onChange={(e) =>
                setFormData({ ...formData, municipio: e.target.value })
              }
              className="border-[2px] border-gray-300 rounded-[4px] px-[0.8rem] pr-[2rem] h-[2.7rem] py-[0.4rem] w-full text-black/80 appearance-none focus:outline-none focus:border-blue-500"
              disabled={!formData.estado}
              id="municipio"
              required
            >
              <option value="">
                {formData.estado
                  ? "Selecione o município"
                  : "Escolha o estado primeiro"}
              </option>
              {formData.estado === "CE" && (
                <>
                  <option value="Fortaleza">Fortaleza</option>
                  <option value="Sobral">Sobral</option>
                  <option value="Juazeiro do Norte">Juazeiro do Norte</option>
                  <option value="Acaraú">Acaraú</option>
                </>
              )}
              {formData.estado === "SP" && (
                <>
                  <option value="São Paulo">São Paulo</option>
                  <option value="Campinas">Campinas</option>
                  <option value="Santos">Santos</option>
                  <option value="Ribeirão Preto">Ribeirão Preto</option>
                </>
              )}
              {formData.estado === "RJ" && (
                <>
                  <option value="Rio de Janeiro">Rio de Janeiro</option>
                  <option value="Niterói">Niterói</option>
                  <option value="Petrópolis">Petrópolis</option>
                  <option value="Volta Redonda">Volta Redonda</option>
                </>
              )}
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

          <div className="flex flex-col w-full relative">
            <input
              type={showPassword ? "text" : "password"}
              name="senha"
              onChange={handleChange}
              className="border-[2px] peer text-black/80 border-gray-300 rounded-[4px] px-[0.8rem] py-[0.4rem] h-[2.7rem] w-full focus:outline-none focus:border-blue-500"
              placeholder="Senha"
              id="senha"
              minLength={6}
              required
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-600"
            >
              {showPassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7
                 a9.964 9.964 0 012.235-3.592M3 3l18 18"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5
                 c4.477 0 8.268 2.943 9.542 7
                 -1.274 4.057-5.065 7-9.542 7
                 -4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              )}
            </button>

            <label
              className="absolute left-3 top-[-10px] px-1 bg-white text-blue-500 font-[600] text-sm opacity-0 peer-focus:opacity-100 transition"
              htmlFor="senha"
            >
              Senha
            </label>
          </div>

          <div className="flex flex-col w-full relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmarSenha"
              onChange={handleChange}
              className="border-[2px] peer text-black/80 border-gray-300 rounded-[4px] px-[0.8rem] py-[0.4rem] h-[2.7rem] w-full focus:outline-none focus:border-blue-500"
              placeholder="Confirmar Senha"
              id="confirmarSenha"
              minLength={6}
              required
            />

            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-600"
            >
              {showConfirmPassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7
                 a9.964 9.964 0 012.235-3.592M3 3l18 18"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5
                 c4.477 0 8.268 2.943 9.542 7
                 -1.274 4.057-5.065 7-9.542 7
                 -4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              )}
            </button>

            <label
              className="absolute left-3 top-[-10px] px-1 bg-white text-blue-500 font-[600] text-sm opacity-0 peer-focus:opacity-100 transition"
              htmlFor="confirmarSenha"
            >
              Confirmar Senha
            </label>
          </div>

          {error && (
            <p className="mt-[-0.5rem] text-red-600 text-[12px] font-[400] self-start tracking-[0.75px]">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 transition-all duration-[0.5s] w-full py-[0.545rem] h-[2.7rem] mt-[0.4rem] text-[14px] font-[600] tracking-[0.5px] rounded-[4px] text-white"
          >
            Cadastre-se
          </button>
        </form>

        <p className="text-[12px] font-[400] mt-[0.7rem] tracking-[0.75px] text-[black]">
          Já tem uma conta?{" "}
          <Link href="/login" className="text-blue-500 hover:underline">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  );
}
