import { clearAuth } from "./authStorage";
import API from "./api";

export const logoutUser = async () => {
  try {
    await clearAuth();

    delete API.defaults.headers.common.Authorization;
  } catch (err) {
    console.log("Logout error:", err);
  }
};