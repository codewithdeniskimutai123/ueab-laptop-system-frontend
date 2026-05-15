import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";

import LogoutButton from "../../components/LogoutButton";
import { getProfile } from "../../services/profileService";

export default function StudentDashboard() {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const res = await getProfile();
      const data = res?.user ?? res;
      setUser(data);
    } catch (err) {
      console.log("DASHBOARD PROFILE ERROR:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-[#0B1220] justify-center items-center">
        <ActivityIndicator size="large" color="#3B82F6" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#0B1220]">
      <ScrollView className="px-5 pt-5">

        <View className="flex-row justify-between items-center mb-6">

          <View>
            <Text className="text-gray-400 text-base">
              Welcome 
            </Text>

            <Text className="text-white text-2xl font-bold">
              {user?.username || "Student"}
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => router.push("/(student)/profile")}
            className="bg-[#111A2E] p-3 rounded-full"
          >
            <Ionicons name="person-outline" size={26} color="white" />
          </TouchableOpacity>

        </View>

        <View className="bg-[#111A2E] rounded-3xl p-5 mb-6">

          <View className="flex-row justify-between items-center">
            <Text className="text-white text-xl font-bold">
              My Laptop
            </Text>

            <Ionicons name="laptop-outline" size={28} color="#3B82F6" />
          </View>

          <Text className="text-gray-400 mt-2">
            Assigned laptop information will appear here.
          </Text>

        </View>

        <Text className="text-white text-xl font-bold mb-4">
          Quick Actions
        </Text>

        <View className="flex-row flex-wrap justify-between">

          <DashboardCard
            title="My Laptop"
            icon="laptop-outline"
            onPress={() => router.push("/(student)/my-laptop")}
          />

          <DashboardCard
            title="My QR Code"
            icon="qr-code-outline"
            onPress={() => router.push("/(student)/qr-code")}
          />

          <DashboardCard
            title="Transfer"
            icon="swap-horizontal-outline"
            onPress={() => router.push("/(student)/transfer-laptop")}
          />

          <DashboardCard
            title="Transactions"
            icon="document-text-outline"
            onPress={() => router.push("/(student)/transactions")}
          />

          <DashboardCard
            title="Recent Activity"
            icon="time-outline"
            onPress={() => router.push("/(student)/recent-transactions")}
          />

          <DashboardCard
            title="Profile"
            icon="person-circle-outline"
            onPress={() => router.push("/(student)/profile")}
          />

        </View>

        <View className="mt-8 mb-10">
          <LogoutButton />
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

function DashboardCard({ title, icon, onPress }: any) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-[#111A2E] w-[48%] p-5 rounded-3xl mb-4"
    >
      <Ionicons name={icon} size={32} color="#3B82F6" />

      <Text className="text-white font-semibold text-base mt-3">
        {title}
      </Text>
    </TouchableOpacity>
  );
}