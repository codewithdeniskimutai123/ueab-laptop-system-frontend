import { View, Text, Image, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
export default function Home() {
  return (
    <SafeAreaView className="flex-1 bg-[#0B1220]">
      
      <ScrollView className="px-5 pt-6">

        <Text className="text-white text-2xl font-bold">
          UEAB Laptop Security System
        </Text>

        <Text className="text-gray-400 mt-2 text-sm">
          Secure • Smart • Real-time Tracking
        </Text>

        {/* QR SCANNING IMAGE SECTION */}
        <View className="mt-6 bg-[#111A2E] p-3 rounded-2xl">

          <Text className="text-white font-semibold mb-3">
            Scan Laptop QR Code
          </Text>

          <Image
            source={require("../assets/images/phoneScanning.png")}
            className="w-full h-32 rounded-xl"
            resizeMode="contain"
          />

          <Text className="text-gray-400 mt-3 text-sm">
            Use your phone camera to scan and verify laptop entry & exit instantly.
          </Text>
        </View>

        <View className="mt-5 bg-[#111A2E] p-3 rounded-2xl">

          <Text className="text-white font-semibold mb-3">
           Tracked Library Laptop
          </Text>

          <Image
            source={require("../assets/images/stdlaptop.jpg")}
            className="w-full h-32 rounded-xl"
            resizeMode="cover"
          />

          <Text className="text-gray-400 mt-3 text-sm">
            Monitoring laptop movement within the library to 
            ensure secure check-in and check-out tracking in real-time.
          </Text>

        </View>

      </ScrollView>
    </SafeAreaView>
  );
}