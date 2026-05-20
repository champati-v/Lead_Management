import axios from "axios";

export const TOKEN_KEY = "sl_token";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "https://lead-management-o71u.onrender.com",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
