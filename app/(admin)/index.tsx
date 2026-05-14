import { View, Text } from "react-native";

export default function StudentHome() {
  return (
    <View className="flex-1 bg-[#0B1220] items-center justify-center">
      <Text className="text-white text-2xl font-bold">
        Admin Dashboard
      </Text>

      <Text className="text-gray-400 mt-3">
        Manage users, laptops & system logs
      </Text>
    </View>
  );
}