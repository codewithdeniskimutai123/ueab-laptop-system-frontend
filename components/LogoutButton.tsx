import { Pressable, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import { logoutUser } from "../services/logoutService";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logoutUser();

      Toast.show({
        type: "success",
        text1: "Logged out successfully",
      });

      router.replace("/(auth)/login");
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Logout failed",
      });
    }
  };

  return (
    <View className="px-1 mt-6 mb-8 w-full">
      <Pressable
        onPress={handleLogout}
        style={({ pressed }) => ({
          opacity: pressed ? 0.9 : 1.0,
          transform: [{ scale: pressed ? 0.97 : 1.0 }],
        })}
        className="flex-row items-center justify-center bg-[#EF4444] p-4 rounded-2xl shadow-lg shadow-red-500/20"
      >
        <Ionicons name="log-out-outline" size={22} color="white" />
        <Text className="text-white font-bold text-base ml-2 tracking-wide">
          Logout
        </Text>
      </Pressable>
    </View>
  );
}
