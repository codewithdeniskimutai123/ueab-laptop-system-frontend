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
import { getMyLaptop } from "@/services/studentService";

export default function StudentDashboard() {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [laptop, setLaptop] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [profileRes, laptopRes] = await Promise.all([
        getProfile(),
        getMyLaptop().catch(() => null),
      ]);

      const userData = profileRes?.user ?? profileRes;
      setUser(userData);
      setLaptop(laptopRes);
    } catch (err) {
      console.log("DASHBOARD ERROR:", err);
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

  const currentUserId = user?.id;
  const isUserOwner = currentUserId === laptop?.owner_id;
  const isUserHolder = currentUserId === laptop?.current_holder_id;
  const isOwnerHolding = laptop?.owner_id === laptop?.current_holder_id;

  return (
    <SafeAreaView className="flex-1 bg-[#0B1220]">
      <ScrollView className="px-5 pt-5" showsVerticalScrollIndicator={false}>

        <View className="flex-row justify-between items-center mb-6">
          <View>
            <Text className="text-gray-400 text-lg">Welcome back,</Text>
            <Text className="text-white text-2xl font-bold">
              {user?.first_name || user?.username || "Student"}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => router.push("/(student)/profile")}
            className="bg-[#111A2E] p-3 rounded-full"
          >
            <Ionicons name="person-outline" size={26} color="white" />
          </TouchableOpacity>
        </View>

        <View className="bg-[#111A2E] rounded-3xl p-5 mb-6 border border-slate-800">
          <View className="flex-row justify-between items-center">
            <Text className="text-white text-xl font-bold">Hardware Registry</Text>
            <Ionicons name="laptop-outline" size={28} color="#3B82F6" />
          </View>

          {!laptop ? (
            <View className="mt-4 p-4 bg-slate-900/50 rounded-2xl border border-dashed border-slate-700">
              <Text className="text-gray-400 text-center">
                🚫 You have no laptop logs assigned to your profile.
              </Text>
            </View>
          ) : (
            <>
              <Text className="text-gray-300 mt-4 text-base font-medium">
                {laptop.brand} • <Text className="text-[#3B82F6]">{laptop.serial_number}</Text>
              </Text>

              <View className="mt-3 space-y-1">
                <Text className="text-gray-400 text-sm">
                  Owner: <Text className="text-white font-semibold">{laptop.owner_name}</Text>
                </Text>
                <Text className="text-gray-400 text-sm">
                  Current Holder: <Text className="text-white font-semibold">{laptop.current_holder_name}</Text>
                </Text>
              </View>

              <View className="mt-5">
                {isUserOwner && isOwnerHolding && (
                  <View className="bg-emerald-950/80 border border-emerald-500/30 px-4 py-3 rounded-2xl flex-row items-center">
                    <Ionicons name="checkmark-circle-outline" size={20} color="#10B981" />
                    <Text className="text-emerald-400 font-bold ml-2 flex-1">
                      ✔ You are holding your laptop. It is securely in your hands.
                    </Text>
                  </View>
                )}

                {isUserOwner && !isOwnerHolding && (
                  <View className="bg-amber-950/80 border border-amber-500/30 px-4 py-3 rounded-2xl flex-row items-center">
                    <Ionicons name="alert-circle-outline" size={20} color="#F59E0B" />
                    <Text className="text-amber-400 font-bold ml-2 flex-1">
                      ⚠ Your laptop is currently with{" "}
                      <Text className="text-white underline font-extrabold">
                        {laptop.current_holder_name || "another student"}
                      </Text>.
                    </Text>
                  </View>
                )}

                {!isUserOwner && isUserHolder && (
                  <View className="bg-blue-950/80 border border-blue-500/30 px-4 py-3 rounded-2xl flex-row items-center">
                    <Ionicons name="information-circle-outline" size={20} color="#3B82F6" />
                    <Text className="text-blue-400 font-bold ml-2 flex-1">
                      ℹ You are holding this laptop. It belongs to {laptop.owner_name}.
                    </Text>
                  </View>
                )}
              </View>
            </>
          )}
        </View>

        <Text className="text-white text-xl font-bold mb-4">Quick Actions</Text>
        <View className="flex-row flex-wrap justify-between">
          <DashboardCard title="My Laptop" icon="laptop-outline" onPress={() => router.push("/(student)/my-laptop")} />
          <DashboardCard title="My QR" icon="qr-code-outline" onPress={() => router.push("/(student)/qr-code")} />
          <DashboardCard title="Transfer" icon="swap-horizontal-outline" onPress={() => router.push("/(student)/transfer-laptop")} />
          <DashboardCard title="Transactions" icon="document-text-outline" onPress={() => router.push("/(student)/transactions")} />
          <DashboardCard title="Profile" icon="person-circle-outline" onPress={() => router.push("/(student)/profile")} />
        </View>

        <View className="mt-6 mb-12">
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
      activeOpacity={0.7}
      className="bg-[#111A2E] w-[48%] p-5 rounded-3xl mb-4 border border-slate-800/60"
    >
      <Ionicons name={icon} size={28} color="#3B82F6" />
      <Text className="text-white font-semibold text-base mt-3">{title}</Text>
    </TouchableOpacity>
  );
}
