import API from "./api";

export const scanQR = (qr_data: string) => {
  return API.post("/transactions/scan_qr/", { qr_data });
};

export const previewTransaction = (data: {
  username?: string;
  serial_number?: string;
  laptop_id?: number;
}) => {
  return API.post("/transactions/preview/", data);
};

export const confirmTransaction = (data: {
  laptop_id: number;
  action: "IN" | "OUT";
}) => {
  return API.post("/transactions/confirm/", data);
};

export const getRecentLogs = () => {
  return API.get("/transactions/recent_transactions/");
};