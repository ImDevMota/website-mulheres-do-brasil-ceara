import api from "./api";

interface RegisterData {
  nome: string;
  cpf: string;
  email: string;
  estado: string;
  municipio: string;
  profissao: string;
  telefone: string;
  senha: string;
}

export async function register(
  nome: string,
  cpf: string,
  email: string,
  estado: string,
  municipio: string,
  profissao: string,
  telefone: string,
  senha: string
) {
  const response = await api.post("/users", {
    nome,
    cpf,
    email,
    estado,
    municipio,
    profissao,
    telefone,
    senha,
  });

  return response.data;
}

export async function login(cpf: string, senha: string) {
  const response = await api.post("/auth", { cpf, senha });
  localStorage.setItem("token", response.data.token);
  return response.data;
}

export async function getUserProfile() {
  const token = localStorage.getItem("token");
  if (!token) return null;

  const response = await api.get("/auth/me");
  return response.data;
}
