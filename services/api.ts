import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
});

// IMPORTANT: let axios auto-handle multipart
API.interceptors.request.use((config) => {
  return config;
});

export default API;