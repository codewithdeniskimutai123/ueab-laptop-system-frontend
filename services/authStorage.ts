import AsyncStorage from "@react-native-async-storage/async-storage";

const AUTH_KEY = "auth_data";

export const saveAuth = async (data: any) => {
  await AsyncStorage.setItem(
    AUTH_KEY,
    JSON.stringify(data)
  );
};

export const getAuth = async () => {
  const data =
    await AsyncStorage.getItem(AUTH_KEY);

  return data
    ? JSON.parse(data)
    : null;
};

export const clearAuth = async () => {
  await AsyncStorage.removeItem(AUTH_KEY);
};



export const getUser = async () => {
  const auth = await getAuth();
  return auth?.user || null;
};


export const getToken = async () => {
  const auth = await getAuth();
  return auth?.token || null;
};


export const isLoggedIn = async () => {
  const auth = await getAuth();
  return !!auth?.token;
};


export const getUserRole = async () => {
  const auth = await getAuth();
  return auth?.user?.role || null;
};

export const getCurrentUserId = async () => {
  const data = await getAuth();
  return data?.user?.id || data?.id || null;
};