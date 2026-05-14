import { View, Text } from "react-native";

export default function SecurityHome() {
  return (
    <View className="flex-1 bg-[#0B1220] items-center justify-center">
      <Text className="text-white text-2xl font-bold">
        Security Dashboard
      </Text>

      <Text className="text-gray-400 mt-3">
        Monitor laptop entries & exits
      </Text>
    </View>
  );
}