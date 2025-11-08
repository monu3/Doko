import axios from "axios";

const baseURL = (import.meta as any).env?.VITE_API_URL || "http://localhost:8080";

const api = axios.create({
  baseURL, // Backend base URL
  withCredentials: true, // Include cookies in requests
  // headers: {
  //   "Content-Type": "application/json",
  // },
});

export default api;
