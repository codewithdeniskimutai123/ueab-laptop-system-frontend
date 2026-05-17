import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import LogoutButton from "../../components/LogoutButton"; 

export default function SecurityDashboard() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-[#0B1220]">
      <ScrollView className="px-5 pt-6" showsVerticalScrollIndicator={false}>

        <View className="bg-[#1E293B]/40 border border-slate-800 rounded-3xl p-5 mb-6 flex-row items-center justify-between">
          <View className="flex-1 pr-3">
            <View className="flex-row items-center">
              <View className="w-2.5 h-2.5 rounded-full bg-emerald-500 mr-2 animate-pulse" />
              <Text className="text-emerald-400 font-extrabold text-xs tracking-widest uppercase">
                Gate Controller Active
              </Text>
            </View>
            <Text className="text-white text-2xl font-black mt-1 tracking-tight">
              Security Mode
            </Text>
            <Text className="text-slate-400 text-xs font-mono mt-0.5 uppercase tracking-wide">
              UEAB Library Guard Station
            </Text>
          </View>
          
          <TouchableOpacity
            onPress={() => router.push("/(security)/profile/index")}
            activeOpacity={0.8}
            className="bg-blue-600/10 p-4 rounded-2xl border border-blue-500/20 shadow-xl"
          >
            <Ionicons name="shield-checkmark" size={28} color="#3B82F6" />
          </TouchableOpacity>
        </View>

        <Text className="text-slate-400 text-sm mb-5 leading-normal">
          Select an operational routing target below to audit student computing hardware, track temporary device transfers, or evaluate historical traffic metrics.
        </Text>

        <Text className="text-xs font-black tracking-widest uppercase mb-3 text-slate-400">
          Gate Management
        </Text>
        
        <View className="flex-row flex-wrap justify-between">
          
          <TouchableOpacity
            onPress={() => router.push("/(security)/scan-qr")}
            activeOpacity={0.8}
            className="bg-[#111A2E] w-[48%] p-5 rounded-3xl mb-4 border border-slate-800/80 justify-between min-h-[175px] shadow-lg"
          >
            <View className="bg-blue-500/10 p-3 rounded-2xl w-12 h-12 justify-center items-center border border-blue-500/10">
              <Ionicons name="scan-outline" size={24} color="#3B82F6" />
            </View>
            <View>
              <Text className="text-white font-extrabold text-base mt-4 tracking-tight">Scan Badge QR</Text>
              <Text className="text-slate-400 text-xs mt-1.5 leading-snug">Launch camera to read structural laptop digital keys.</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/(security)/search-user")}
            activeOpacity={0.8}
            className="bg-[#111A2E] w-[48%] p-5 rounded-3xl mb-4 border border-slate-800/80 justify-between min-h-[175px] shadow-lg"
          >
            <View className="bg-emerald-500/10 p-3 rounded-2xl w-12 h-12 justify-center items-center border border-emerald-500/10">
              <Ionicons name="search-outline" size={24} color="#10B981" />
            </View>
            <View>
              <Text className="text-white font-extrabold text-base mt-4 tracking-tight">Manual Search</Text>
              <Text className="text-slate-400 text-xs mt-1.5 leading-snug">Audit device parameters using student account usernames.</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/(security)/recent-logs")}
            activeOpacity={0.85}
            className="bg-[#111A2E] w-full p-5 rounded-3xl mb-6 border border-slate-800/80 flex-row items-center justify-between shadow-md"
          >
            <View className="flex-row items-center flex-1 pr-4">
              <View className="bg-amber-500/10 p-3.5 rounded-2xl w-14 h-14 justify-center items-center mr-4 border border-amber-500/10">
                <Ionicons name="time-outline" size={26} color="#F59E0B" />
              </View>
              <View className="flex-1">
                <Text className="text-white font-bold text-base tracking-tight">Today's Audit History</Text>
                <Text className="text-slate-400 text-xs mt-1 leading-normal">
                  Review logs for the latest 20 computer checks executed during your shift.
                </Text>
              </View>
            </View>
            <View className="bg-[#0B1220] p-2 rounded-full border border-slate-800">
              <Ionicons name="chevron-forward-outline" size={18} color="#64748B" />
            </View>
          </TouchableOpacity>

        </View>

        <Text className="text-xs font-black tracking-widest uppercase mb-3 text-slate-400">
          Account Control
        </Text>

        <TouchableOpacity
          onPress={() => router.push("/(security)/profile/index")}
          activeOpacity={0.8}
          className="bg-[#111A2E]/50 w-full p-4 rounded-2xl mb-4 border border-slate-800/60 flex-row items-center justify-between"
        >
          <View className="flex-row items-center">
            <Ionicons name="person-circle-outline" size={24} color="#64748B" />
            <Text className="text-slate-300 font-semibold text-sm ml-3">Manage Officer Profile Details</Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color="#475569" />
        </TouchableOpacity>

        <View className="mt-4 mb-14">
          <LogoutButton />
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
