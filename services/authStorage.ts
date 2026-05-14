import AsyncStorage from "@react-native-async-storage/async-storage";

export const saveAuth = async (data: {
  access: string;
  refresh: string;
  role: string;
  username: string;
}) => {
  await AsyncStorage.multiSet([
    ["access", data.access],
    ["refresh", data.refresh],
    ["role", data.role],
    ["username", data.username],
  ]);
};

export const getRole = async () => {
  return await AsyncStorage.getItem("role");
};