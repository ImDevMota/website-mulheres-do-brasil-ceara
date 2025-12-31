import api from "./api";

export async function register(
  nome: string,
  genero: string,
  cpf: string,
  email: string,
  estado: string,
  municipio: string,
  profissao: string,
  telefone: string,
  senha: string
) {
  const response = await api.post("/user", {
    nome,
    genero,
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
  const response = await api.post("/auth/login", { cpf, senha });
  localStorage.setItem("token", response.data.token);
  return response.data;
}

export async function getUserProfile() {
  const token = localStorage.getItem("token");
  if (!token) return null;

  const response = await api.get("/auth/me");
  return response.data;
}
