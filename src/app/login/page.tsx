"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

import { login } from "../services/auth";
import Header from "../components/Header";
import Footer from "../components/Footer";

interface LoginFormData {
  cpf: string;
  senha: string;
}

export default function Login() {
  const [formData, setFormData] = useState<LoginFormData>({
    cpf: "",
    senha: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const [cpfError, setCpfError] = useState("");

  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

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

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    setError("");

    try {
      const response = await login(formData.cpf, formData.senha);

      if (!response) {
        toast.error("Usuário não encontrado");
        setError("Usuário não encontrado");
        return;
      }

      toast.success("Login realizado com sucesso!");

      router.push("/dashboard");
    } catch (err: any) {
      const status = err.response?.status;
      const errorData = err.response?.data;
      const errorCode = errorData?.error || "";
      const errorMessage = errorData?.message || err.message || "";

      console.log("Erro capturado:", { status, errorCode, errorMessage });

      // 404 = CPF não encontrado
      if (status === 404 || errorCode === "CPF_NAO_REGISTRADO") {
        setError("Este CPF não está cadastrado no sistema");
        toast.error("CPF não cadastrado");
      }
      // 401 = Senha incorreta
      else if (status === 401 || errorCode === "SENHA_INCORRETA") {
        setError("A senha informada está incorreta");
        toast.error("Senha incorreta");
      }
      // 400 = Campos obrigatórios
      else if (status === 400 || errorCode === "CAMPOS_OBRIGATORIOS") {
        setError("Preencha todos os campos corretamente");
        toast.error("Preencha todos os campos");
      }
      // Outros erros
      else {
        setError(errorMessage || "Erro ao realizar login. Tente novamente");
        toast.error("Erro ao realizar login");
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />

      <main className="flex-grow flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl px-8 py-10">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Bem-vindo(a) de volta!
            </h1>
            <p className="text-gray-600 mt-2">Entre para acessar sua conta</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex flex-col w-full relative group pb-6">
              <label
                className="text-sm font-medium text-gray-700 mb-2 transition-colors group-focus-within:text-[#e91e63]"
                htmlFor="cpf"
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

            <div className="flex flex-col w-full relative group pb-0 mb-11  ">
              <label
                className="text-sm font-medium text-gray-700 mb-2 transition-colors group-focus-within:text-[#e91e63]"
                htmlFor="senha"
              >
                Senha
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="senha"
                  onChange={handleChange}
                  className="border-2 text-gray-800 border-gray-200 rounded-xl px-4 pr-12 h-12 w-full bg-gray-50/50 shadow-sm hover:border-gray-300 focus:outline-none focus:border-[#e91e63] focus:ring-2 focus:ring-[#fce4ec] focus:bg-white transition-all"
                  placeholder="••••••••"
                  id="senha"
                  minLength={6}
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
            </div>

            {error && (
              <div className="w-full mt-[-1.25rem] bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4 shrink-0"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-[#e91e63] hover:bg-[#c2185b] text-white py-3 h-12 font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Entrar
            </button>
          </form>

          <p className="text-center text-gray-600 text-sm mt-6">
            Novo usuário?{" "}
            <Link
              href={"/register"}
              className="text-[#e91e63] font-semibold hover:underline"
            >
              Cadastre-se
            </Link>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
