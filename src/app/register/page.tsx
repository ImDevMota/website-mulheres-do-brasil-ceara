"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

import { register } from "../services/auth";
import Header from "../components/Header";
import Footer from "../components/Footer";

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

  const [cpfError, setCpfError] = useState("");
  const [telefoneError, setTelefoneError] = useState("");

  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setFormData({ ...formData, [event.target.name]: event.target.value });

  const handleCPFChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let valor = event.target.value.replace(/\D/g, "");

    if (valor.length <= 11) {
      valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
      valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
      valor = valor.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    } else {
      valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
      valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
      valor = valor.replace(/(\d{3})(\d{1,2})$/, "$1-$2");

      setCpfError("Insira um CPF válido!");

      return;
    }

    setCpfError("");
    setFormData({ ...formData, cpf: valor });
  };

  const handleTelefoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let valor = event.target.value.replace(/\D/g, "");

    if (valor.length <= 10) {
      valor = valor.replace(/(\d{2})(\d)/, "($1) $2");
    } else if (valor.length <= 11) {
      valor = valor.replace(/(\d{2})(\d)/, "($1) $2");
      valor = valor.replace(/(\d{5})(\d)/, "$1-$2");
    } else {
      setTelefoneError("Insira um telefone válido!");

      return;
    }

    setTelefoneError("");
    setFormData({ ...formData, telefone: valor });
  };

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
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />

      <main className="flex-grow flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl px-8 py-10">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Junte-se a Nós!
            </h1>
            <p className="text-gray-600 mt-2">Crie sua conta para participar</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col w-full relative">
              <input
                type="text"
                name="nome"
                onChange={handleChange}
                className="border-2 text-gray-800 border-gray-200 rounded-xl px-4 h-12 w-full focus:outline-none focus:border-[#e91e63] focus:ring-2 focus:ring-[#fce4ec] transition-all"
                placeholder="Nome Completo"
                id="nome"
                required
              />
            </div>

            <div className="flex flex-col w-full relative">
              <input
                type="text"
                name="cpf"
                value={formData.cpf}
                onChange={handleCPFChange}
                className="border-2 text-gray-800 border-gray-200 rounded-xl px-4 h-12 w-full focus:outline-none focus:border-[#e91e63] focus:ring-2 focus:ring-[#fce4ec] transition-all"
                placeholder="000.000.000-00"
                id="cpf"
                required
              />
              <p className="text-red-500 text-sm ml-0.5 mt-1">{cpfError}</p>
            </div>

            <div className="flex flex-col w-full relative">
              <input
                type="email"
                name="email"
                onChange={handleChange}
                className="border-2 text-gray-800 border-gray-200 rounded-xl px-4 h-12 w-full focus:outline-none focus:border-[#e91e63] focus:ring-2 focus:ring-[#fce4ec] transition-all"
                placeholder="E-mail"
                id="email"
                required
              />
            </div>

            <div className="flex flex-col w-full relative">
              <input
                type="tel"
                name="telefone"
                value={formData.telefone}
                onChange={handleTelefoneChange}
                className="border-2 text-gray-800 border-gray-200 rounded-xl px-4 h-12 w-full focus:outline-none focus:border-[#e91e63] focus:ring-2 focus:ring-[#fce4ec] transition-all"
                placeholder="(00) 00000-0000"
                id="telefone"
                required
              />
              <p className="text-red-500 text-sm ml-0.5 mt-1">
                {telefoneError}
              </p>
            </div>

            <div className="flex flex-col w-full relative">
              <input
                type="text"
                name="profissao"
                onChange={handleChange}
                className="border-2 text-gray-800 border-gray-200 rounded-xl px-4 h-12 w-full focus:outline-none focus:border-[#e91e63] focus:ring-2 focus:ring-[#fce4ec] transition-all"
                placeholder="Profissão"
                id="profissao"
                required
              />
            </div>

            <div className="flex flex-col w-full relative">
              <select
                name="estado"
                onChange={(e) => {
                  const estado = e.target.value;
                  setFormData({ ...formData, estado, municipio: "" }); // atualiza estado
                }}
                className="border-2 border-gray-200 rounded-xl px-4 pr-8 h-12 w-full text-gray-800 appearance-none focus:outline-none focus:border-[#e91e63] focus:ring-2 focus:ring-[#fce4ec] transition-all"
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
                className="border-2 border-gray-200 rounded-xl px-4 pr-8 h-12 w-full text-gray-800 appearance-none focus:outline-none focus:border-[#e91e63] focus:ring-2 focus:ring-[#fce4ec] transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
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
                className="border-2 text-gray-800 border-gray-200 rounded-xl px-4 h-12 w-full focus:outline-none focus:border-[#e91e63] focus:ring-2 focus:ring-[#fce4ec] transition-all"
                placeholder="Senha"
                id="senha"
                minLength={6}
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 hover:text-[#e91e63] transition-colors"
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
            </div>

            <div className="flex flex-col w-full relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmarSenha"
                onChange={handleChange}
                className="border-2 text-gray-800 border-gray-200 rounded-xl px-4 h-12 w-full focus:outline-none focus:border-[#e91e63] focus:ring-2 focus:ring-[#fce4ec] transition-all"
                placeholder="Confirmar Senha"
                id="confirmarSenha"
                minLength={6}
                required
              />

              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 hover:text-[#e91e63] transition-colors"
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
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-[#e91e63] hover:bg-[#c2185b] text-white py-3 h-12 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              Cadastre-se
            </button>
          </form>

          <p className="text-center text-gray-600 text-sm mt-6">
            Já tem uma conta?{" "}
            <Link
              href="/login"
              className="text-[#e91e63] font-semibold hover:underline"
            >
              Entrar
            </Link>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
