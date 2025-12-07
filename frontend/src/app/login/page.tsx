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

  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

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
    } catch (err) {
      toast.error("Senha ou E-mail Incorretos");
      setError("E-mail ou Senha incorretos");
      return;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      
      <main className="flex-grow flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl px-8 py-10">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Bem-vinda de volta!</h1>
            <p className="text-gray-600 mt-2">Entre para acessar sua conta</p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <div className="flex flex-col w-full relative">
              <label
                className="text-sm font-semibold text-gray-700 mb-2"
                htmlFor="cpf"
              >
                CPF
              </label>
              <input
                type="text"
                name="cpf"
                onChange={handleChange}
                className="border-2 text-gray-800 border-gray-200 rounded-xl px-4 h-12 w-full focus:outline-none focus:border-[#e91e63] focus:ring-2 focus:ring-[#fce4ec] transition-all"
                placeholder="000.000.000-00"
                id="cpf"
                required
              />
            </div>

            <div className="flex flex-col w-full relative">
              <label
                className="text-sm font-semibold text-gray-700 mb-2"
                htmlFor="senha"
              >
                Senha
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="senha"
                  onChange={handleChange}
                  className="border-2 text-gray-800 border-gray-200 rounded-xl px-4 h-12 w-full focus:outline-none focus:border-[#e91e63] focus:ring-2 focus:ring-[#fce4ec] transition-all"
                  placeholder="••••••••"
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
              Entrar
            </button>
          </form>

          <p className="text-center text-gray-600 text-sm mt-6">
            Novo usuário?{" "}
            <Link href={"/register"} className="text-[#e91e63] font-semibold hover:underline">
              Cadastre-se
            </Link>
          </p>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

