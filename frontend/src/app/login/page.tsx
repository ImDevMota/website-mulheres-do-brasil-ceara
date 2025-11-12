"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

// import api from "../../services/api";

interface LoginFormData {
  email: string;
  password: string;
}

export default function Login() {
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
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
      //   const { data: token } = await api.post("/login", {
      //     email: formData.email,
      //     password: formData.password,
      //   });

      //   localStorage.setItem("token", token);
      toast.success("Login realizado com sucesso!");

      router.push("/");
    } catch (err) {
      toast.error("Senha ou E-mail Incorretos");
      setError("E-mail ou Senha incorretos");
      return;
    }
  };

  return (
    <section className="flex items-center w-screen h-screen justify-center bg-gray-100 font-poppins">
      <div className="flex flex-col items-center justify-center w-[90%] sm:w-[30%] bg-white rounded-2xl px-[2.7rem] sm:px-[5rem] sm:py-[3rem] py-[1.3rem] sm:pb-[4rem] pb-[3.5rem]">
        <h1 className="text-[32px] text-black/80 font-[600]">Login</h1>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center justify-center w-[100%] gap-y-[1rem] mt-[1rem]"
        >
          <div className="flex flex-col w-full relative">
            <input
              type="email"
              name="inputEmail"
              onChange={handleChange}
              className="border-[2px] text-black/80 peer border-gray-300 rounded-[4px] px-[0.8rem] py-[0.4rem] h-[2.7rem] w-full focus:outline-none focus:border-blue-500"
              placeholder="E-mail"
              id="inputEmail"
              required
            />

            <label
              className="absolute left-3 top-[-10px] px-1 bg-white text-blue-500 font-[600] text-sm opacity-0 peer-focus:opacity-100 transition"
              htmlFor="inputEmail"
            >
              E-mail
            </label>
          </div>

          <div className="flex flex-col w-full relative">
            <input
              type={showPassword ? "text" : "password"}
              name="inputSenha"
              onChange={handleChange}
              className="border-[2px] text-black/80 peer border-gray-300 rounded-[4px] px-[0.8rem] py-[0.4rem] h-[2.7rem] w-full focus:outline-none focus:border-blue-500"
              placeholder="Senha"
              id="inputSenha"
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
              htmlFor="inputSenha"
            >
              Senha
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
            Log in
          </button>
        </form>

        <p className="text-[12px] font-[400] mt-[0.7rem] tracking-[0.75px] text-[black]/50">
          Novo usuário?{" "}
          <Link href={"/register"} className="text-blue-500 hover:underline">
            Cadastre-se
          </Link>
        </p>
      </div>
    </section>
  );
}
