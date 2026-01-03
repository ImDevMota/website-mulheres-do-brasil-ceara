"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { register } from "../services/auth";
import Header from "../components/Header";
import Footer from "../components/Footer";

interface RegisterFormData {
  nome: string;
  genero: string;
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
    genero: "",
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
  const [emailError, setEmailError] = useState("");
  const [nameError, setNameError] = useState("");

  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (/\d/.test(event.target.value)) {
      setNameError("O nome deve conter apenas letras");
      return;
    }

    if (event.target.value.length < 10) {
      setNameError("O nome deve ter pelo menos 10 caracteres");
      return;
    }

    if (event.target.value.length > 100) {
      setNameError("O nome deve ter no máximo 100 caracteres");
      return;
    }

    setNameError("");
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.length < 8) {
      setPasswordError("A senha deve ter pelo menos 8 caracteres");
      return;
    }
    setPasswordError("");
  };

  const handleConfirmPasswordChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.value !== formData.senha) {
      setConfirmPasswordError("As senhas não coincidem");
      return;
    }
    setConfirmPasswordError("");
  };

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

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const email = event.target.value;
    setFormData({ ...formData, email });

    // Limpa o erro enquanto digita (se houver)
    if (emailError && validateEmail(email)) {
      setEmailError("");
    }
  };

  const handleEmailBlur = () => {
    if (formData.email && !validateEmail(formData.email)) {
      setEmailError("Insira um e-mail válido!");
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!validateEmail(formData.email)) {
      setEmailError("Insira um e-mail válido!");
      return;
    }

    try {
      await register(
        formData.nome,
        formData.genero,
        formData.cpf,
        formData.email,
        formData.estado,
        formData.municipio,
        formData.profissao,
        formData.telefone,
        formData.senha
      );

      router.push("/login");
    } catch (err) {
      console.error(err);
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

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex flex-col w-full relative group pb-6">
              <label
                htmlFor="nome"
                className="text-sm font-medium text-gray-700 mb-2 transition-colors group-focus-within:text-[#e91e63]"
              >
                Nome Completo
              </label>
              <input
                type="text"
                name="nome"
                onChange={handleNameChange}
                className="border-2 text-gray-800 border-gray-200 rounded-xl px-4 h-12 w-full bg-gray-50/50 shadow-sm hover:border-gray-300 focus:outline-none focus:border-[#e91e63] focus:ring-2 focus:ring-[#fce4ec] focus:bg-white transition-all"
                placeholder="Digite seu nome completo"
                id="nome"
                required
              />

              {nameError && (
                <p className="text-red-500 text-xs mt-1">{nameError}</p>
              )}
            </div>

            <div className="flex flex-col w-full pb-6">
              <label className="text-sm font-medium text-gray-700 mb-3">
                Gênero
              </label>

              <div className="flex flex-row gap-3">
                <label
                  htmlFor="feminino"
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 cursor-pointer transition-all ${
                    formData.genero === "Feminino"
                      ? "border-[#e91e63] bg-[#fce4ec] text-[#e91e63] shadow-md"
                      : "border-gray-200 bg-gray-50/50 text-gray-600 hover:border-gray-300 hover:bg-gray-100"
                  }`}
                >
                  <input
                    type="radio"
                    name="genero"
                    value="Feminino"
                    onChange={handleChange}
                    id="feminino"
                    className="sr-only"
                    required
                  />

                  <span className="font-medium">Feminino</span>
                </label>

                <label
                  htmlFor="masculino"
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 cursor-pointer transition-all ${
                    formData.genero === "Masculino"
                      ? "border-[#e91e63] bg-[#fce4ec] text-[#e91e63] shadow-md"
                      : "border-gray-200 bg-gray-50/50 text-gray-600 hover:border-gray-300 hover:bg-gray-100"
                  }`}
                >
                  <input
                    type="radio"
                    name="genero"
                    value="Masculino"
                    onChange={handleChange}
                    id="masculino"
                    className="sr-only"
                    required
                  />
                  <span className="font-medium">Masculino</span>
                </label>
              </div>
            </div>

            <div className="flex flex-col w-full relative group pb-6">
              <label
                htmlFor="cpf"
                className="text-sm font-medium text-gray-700 mb-2 transition-colors group-focus-within:text-[#e91e63]"
              >
                CPF
              </label>
              <input
                type="text"
                name="cpf"
                value={formData.cpf}
                onChange={handleCPFChange}
                className={`border-2 text-gray-800 rounded-xl px-4 h-12 w-full bg-gray-50/50 shadow-sm hover:border-gray-300 focus:outline-none focus:border-[#e91e63] focus:ring-2 focus:ring-[#fce4ec] focus:bg-white transition-all ${
                  cpfError ? "border-red-300 bg-red-50/50" : "border-gray-200"
                }`}
                placeholder="000.000.000-00"
                id="cpf"
                required
              />
              {cpfError && (
                <p className="absolute bottom-0 left-0 text-red-500 text-xs font-medium flex items-center gap-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-3.5 h-3.5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {cpfError}
                </p>
              )}
            </div>

            <div className="flex flex-col w-full relative group pb-6">
              <label
                htmlFor="email"
                className="text-sm font-medium text-gray-700 mb-2 transition-colors group-focus-within:text-[#e91e63]"
              >
                E-mail
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleEmailChange}
                onBlur={handleEmailBlur}
                className={`border-2 text-gray-800 rounded-xl px-4 h-12 w-full bg-gray-50/50 shadow-sm hover:border-gray-300 focus:outline-none focus:border-[#e91e63] focus:ring-2 focus:ring-[#fce4ec] focus:bg-white transition-all ${
                  emailError ? "border-red-300 bg-red-50/50" : "border-gray-200"
                }`}
                placeholder="seu@email.com"
                id="email"
                required
              />
              {emailError && (
                <p className="absolute bottom-0 left-0 text-red-500 text-xs font-medium flex items-center gap-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-3.5 h-3.5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {emailError}
                </p>
              )}
            </div>

            <div className="flex flex-col w-full relative group pb-6">
              <label
                htmlFor="telefone"
                className="text-sm font-medium text-gray-700 mb-2 transition-colors group-focus-within:text-[#e91e63]"
              >
                Telefone
              </label>
              <input
                type="tel"
                name="telefone"
                value={formData.telefone}
                onChange={handleTelefoneChange}
                className={`border-2 text-gray-800 rounded-xl px-4 h-12 w-full bg-gray-50/50 shadow-sm hover:border-gray-300 focus:outline-none focus:border-[#e91e63] focus:ring-2 focus:ring-[#fce4ec] focus:bg-white transition-all ${
                  telefoneError
                    ? "border-red-300 bg-red-50/50"
                    : "border-gray-200"
                }`}
                placeholder="(00) 00000-0000"
                id="telefone"
                required
              />
              {telefoneError && (
                <p className="absolute bottom-0 left-0 text-red-500 text-xs font-medium flex items-center gap-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-3.5 h-3.5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {telefoneError}
                </p>
              )}
            </div>

            <div className="flex flex-col w-full relative group pb-6">
              <label
                htmlFor="profissao"
                className="text-sm font-medium text-gray-700 mb-2 transition-colors group-focus-within:text-[#e91e63]"
              >
                Profissão
              </label>
              <input
                type="text"
                name="profissao"
                onChange={handleChange}
                className="border-2 text-gray-800 border-gray-200 rounded-xl px-4 h-12 w-full bg-gray-50/50 shadow-sm hover:border-gray-300 focus:outline-none focus:border-[#e91e63] focus:ring-2 focus:ring-[#fce4ec] focus:bg-white transition-all"
                placeholder="Educador, estudante, etc."
                id="profissao"
                required
              />
            </div>

            <div className="flex flex-col w-full relative group pb-6">
              <label
                htmlFor="estado"
                className="text-sm font-medium text-gray-700 mb-2 transition-colors group-focus-within:text-[#e91e63]"
              >
                Estado
              </label>
              <div className="relative">
                <select
                  name="estado"
                  onChange={(e) => {
                    const estado = e.target.value;
                    setFormData({ ...formData, estado, municipio: "" });
                  }}
                  className="border-2 border-gray-200 rounded-xl px-4 pr-10 h-12 w-full text-gray-800 bg-gray-50/50 shadow-sm appearance-none cursor-pointer hover:border-gray-300 focus:outline-none focus:border-[#e91e63] focus:ring-2 focus:ring-[#fce4ec] focus:bg-white transition-all"
                  id="estado"
                  required
                >
                  <option value="">Selecione o Estado</option>
                  <option value="CE">Ceará</option>
                  <option value="SP">São Paulo</option>
                  <option value="RJ">Rio de Janeiro</option>
                </select>

                <svg
                  className="w-5 h-5 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400"
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
            </div>

            <div className="flex flex-col w-full relative group pb-6">
              <label
                htmlFor="municipio"
                className="text-sm font-medium text-gray-700 mb-2 transition-colors group-focus-within:text-[#e91e63]"
              >
                Município
              </label>
              <div className="relative">
                <select
                  name="municipio"
                  onChange={(e) =>
                    setFormData({ ...formData, municipio: e.target.value })
                  }
                  className="border-2 border-gray-200 rounded-xl px-4 pr-10 h-12 w-full text-gray-800 bg-gray-50/50 shadow-sm appearance-none cursor-pointer hover:border-gray-300 focus:outline-none focus:border-[#e91e63] focus:ring-2 focus:ring-[#fce4ec] focus:bg-white transition-all disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
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
                      <option value="Juazeiro do Norte">
                        Juazeiro do Norte
                      </option>
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
                  className="w-5 h-5 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400"
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
            </div>

            <div className="flex flex-col w-full relative group pb-6">
              <label
                htmlFor="senha"
                className="text-sm font-medium text-gray-700 mb-2 transition-colors group-focus-within:text-[#e91e63]"
              >
                Senha
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="senha"
                  onChange={handlePasswordChange}
                  className="border-2 text-gray-800 border-gray-200 rounded-xl px-4 pr-12 h-12 w-full bg-gray-50/50 shadow-sm hover:border-gray-300 focus:outline-none focus:border-[#e91e63] focus:ring-2 focus:ring-[#fce4ec] focus:bg-white transition-all"
                  placeholder="Mínimo 8 caracteres"
                  id="senha"
                  minLength={8}
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400 hover:text-[#e91e63] transition-colors"
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
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.964 9.964 0 012.235-3.592M3 3l18 18"
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
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>

              {passwordError && (
                <p className="absolute bottom-0 left-0 text-red-500 text-xs font-medium flex items-center gap-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-3.5 h-3.5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {passwordError}
                </p>
              )}
            </div>

            <div className="flex flex-col w-full relative group pb-6">
              <label
                htmlFor="confirmarSenha"
                className="text-sm font-medium text-gray-700 mb-2 transition-colors group-focus-within:text-[#e91e63]"
              >
                Confirmar Senha
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmarSenha"
                  onChange={handleConfirmPasswordChange}
                  className="border-2 text-gray-800 border-gray-200 rounded-xl px-4 pr-12 h-12 w-full bg-gray-50/50 shadow-sm hover:border-gray-300 focus:outline-none focus:border-[#e91e63] focus:ring-2 focus:ring-[#fce4ec] focus:bg-white transition-all"
                  placeholder="Repita a senha"
                  id="confirmarSenha"
                  minLength={6}
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400 hover:text-[#e91e63] transition-colors"
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
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.964 9.964 0 012.235-3.592M3 3l18 18"
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
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>

              {confirmPasswordError && (
                <p className="absolute bottom-0 left-0 text-red-500 text-xs font-medium flex items-center gap-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-3.5 h-3.5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {confirmPasswordError}
                </p>
              )}
            </div>

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
