import axios from "axios";

// API EXTERNA (cotação)
const BASE_URL = "https://api.exchangerate-api.com/v4/latest";

export const convertCurrencyExternal = async (fromCurrency, toCurrency, amount) => {
  try {
    const response = await axios.get(`${BASE_URL}/${fromCurrency}`);
    const rate = response.data.rates[toCurrency];

    if (!rate) throw new Error(`Taxa para ${toCurrency} não encontrada`);

    const result = (amount * rate).toFixed(2);
    const timestamp = new Date().toLocaleTimeString();

    return { result, rate, timestamp };
  } catch (error) {
    console.error("Erro na conversão externa:", error);
    throw new Error("Erro ao converter moeda.");
  }
};

// API INTERNA (backend)
export const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:4000/api", // URL do backend
});

// Enviar token automaticamente nas requisições
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// auth
export const loginUser = async (email, password) => {
  return api.post("/auth/login", { usernameOrEmail: email, password });
};

export const registerUser = async (email, password) => {
  return api.post("/auth/register", { email, password });
};

// conversão
export const convertBackend = async (from, to, amount) => {
  return api.post("/currency/convert", { from, to, amount });
};

// histórico
export const getHistory = async () => {
  return api.get("/currency/history");
};

// sugestões
export const sendSuggestion = async (moeda, pais) => {
  return api.post("/suggestions", { moeda, pais });
};

export const searchSuggestions = async (q = "") => {
  return api.get("/suggestions", { params: { q } });
};
