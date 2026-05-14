import API from "./api";

export const registerUser = async (
  userData: FormData
) => {
  try {
    const response = await API.post(
      "/users/register/",
      userData,
      {
        headers: {
          "Content-Type":
            "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};


export const loginUser = async (credentials: any) => {
  try {
    const response = await API.post(
      "/access_token/",
      credentials
    );

    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};