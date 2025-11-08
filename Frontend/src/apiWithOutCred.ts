// src/api/axiosInstance.ts
import axios from "axios";

const baseURL = (import.meta as any).env?.VITE_API_URL || "http://localhost:8080";

const apiWithOutCredentials = axios.create({
  baseURL,
  timeout: 10000, // optional timeout
});

export default apiWithOutCredentials;
