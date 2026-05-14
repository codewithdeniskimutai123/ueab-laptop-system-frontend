import API from "./api";

export const getProfile = async () => {
  try {
    const response = await API.get(
      "/users/student_profile/"
    );

    return response.data;
  } catch (error: any) {
    throw (
      error.response?.data || error
    );
  }
};

export const updateProfile =
  async (data: any) => {
    try {
      const response =
        await API.put(
          "/users/update_profile/",
          data
        );

      return response.data;
    } catch (error: any) {
      throw (
        error.response?.data ||
        error
      );
    }
  };