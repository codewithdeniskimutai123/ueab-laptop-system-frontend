import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import LogoutButton from "@/components/LogoutButton";
export default function StudentHome() {
  const router = useRouter();
  return (
    <>
    <View className="flex-1 bg-[#0B1220] items-center justify-center">
      <Text className="text-white text-2xl font-bold">
        Admin Dashboard
      </Text>

      <Text className="text-gray-400 mt-3">
        Manage users, laptops & system logs
      </Text>
      
    </View>

    <TouchableOpacity
  onPress={() =>
    router.push(
      "/profile"
    )
  }
  className="bg-[#111A2E] p-4 rounded-xl mt-5"
>
  <Text className="text-white text-center">
    My Profile
  </Text>
</TouchableOpacity>
     <LogoutButton />
</>

  );

}



