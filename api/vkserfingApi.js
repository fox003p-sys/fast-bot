import axios from "axios";

const api = axios.create({
  baseURL: "https://vkserfing.ru/api/v2",
  headers: { "Content-Type": "application/json" }
});

export function setToken(token) {
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

export async function getBalance() {
  const res = await api.get("/user.balance");
  return res.data;
}

export default api;
