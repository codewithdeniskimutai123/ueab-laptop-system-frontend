import API from "./api";

export const getAdminAnalytics = () => {
  return API.get("/admin/analytics/");
};

export const adminRegisterLaptop = (data: {
  owner_id: number;
  brand: "HP" | "DELL" | "LENOVO" | "APPLE" | "OTHER";
  serial_number: string;
  current_holder_id?: number;
}) => {
  return API.post("/admin/register_laptop/", data);
};


export const adminModifyUserRole = (user_id: number, role: "student" | "security" | "administrator") => {
  const backendRole = role === "administrator" ? "admin" : role;
  return API.post("/admin/modify_role/", { user_id, role: backendRole });
};

export const adminDeleteLaptop = (laptop_id: number) => {
  return API.delete(`/admin/delete_laptop/${laptop_id}/`);
};

export const adminDeleteUser = (user_id: number) => {
  return API.delete(`/admin/delete_user/${user_id}/`); 
};



export const adminGetUsersList = () => {
  return API.get("/users/list/");
};

export const adminGetLaptopsList = () => {
  return API.get("/admin/list_laptops/");
};


