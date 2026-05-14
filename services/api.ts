import axios from "axios";
import { getAuth, saveAuth, clearAuth } from "./authStorage";
import { jwtDecode } from "jwt-decode";

export const SERVER_URL = "http://127.0.0.1:8000";
export const BASE_URL = `${SERVER_URL}/api`;

const API = axios.create({
  baseURL: BASE_URL,
});

type DecodedToken = {
  exp: number;
};
const isTokenExpired = (token: string) => {
  try {
    const decoded = jwtDecode<DecodedToken>(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  } catch {
    return true;
  }
};


const getValidAccessToken = async () => {
  const auth = await getAuth();

  if (!auth?.access) return null;
  if (!isTokenExpired(auth.access)) {
    return auth.access;
  }

  console.log("Access token expired. Refreshing...");

  if (!auth.refresh) {
    await clearAuth();
    return null;
  }

  try {
    const response = await axios.post(`${BASE_URL}/refresh_refresh/`, {
      refresh: auth.refresh,
    });

    const newAccess = response.data.access;

    await saveAuth({
      ...auth,
      access: newAccess,
    });

    return newAccess;
  } catch (error) {
    console.log("Refresh token sequence failed:", error);
    await clearAuth();
    return null;
  }
};

API.interceptors.request.use(
  async (config) => {
    const publicRoutes = ["/access_token/", "/users/register/", "/refresh_refresh/"];

    const isPublic = publicRoutes.some((route) => config.url === route || config.url?.endsWith(route));

    if (isPublic) {
      return config;
    }

    const token = await getValidAccessToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log(`Attached Bearer token to endpoint: ${config.url}`);
    } else {
      console.log(`Warning: No token available for protected route: ${config.url}`);
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default API;
