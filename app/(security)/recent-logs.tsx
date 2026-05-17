import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { getRecentLogs } from "@/services/securityService";

export default function RecentLogsScreen() {
  const router = useRouter();
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await getRecentLogs();
      setLogs(res.data || []);
    } catch (err) {
      console.log("FETCH LOGS FAULT:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchLogs();
  };

  const formatTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return "Now";
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#0B1220]">
      
      <View className="flex-row items-center px-5 pt-4 mb-4">
        <TouchableOpacity 
          onPress={() => router.replace("/(security)")} 
          className="bg-[#111A2E] p-2.5 rounded-full border border-slate-800 mr-4"
        >
          <Ionicons name="arrow-back-outline" size={22} color="white" />
        </TouchableOpacity>
        <View>
          <Text className="text-white text-2xl font-bold tracking-tight">Today's Audit Log</Text>
          <Text className="text-gray-400 text-xs mt-0.5">Your personal gate registration history</Text>
        </View>
      </View>

      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#3B82F6" />
        </View>
      ) : (
        <ScrollView 
          className="px-5"
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#3B82F6" />
          }
        >
          
          <View className="bg-[#111A2E] border border-slate-800 rounded-3xl p-5 mb-6 flex-row justify-between items-center">
            <View>
              <Text className="text-gray-400 text-xs font-bold uppercase tracking-wider">Total Handled Today</Text>
              <Text className="text-white text-3xl font-black mt-1">{logs.length}</Text>
            </View>
            <Ionicons name="shield-checkmark-outline" size={36} color="#10B981" />
          </View>

          <Text className="text-white text-lg font-bold mb-3">Activity Stream</Text>
          
          {logs.length === 0 ? (
            <View className="bg-[#111A2E]/40 border border-dashed border-slate-800 rounded-3xl p-8 items-center justify-center mt-4">
              <Ionicons name="document-text-outline" size={40} color="#475569" />
              <Text className="text-gray-400 text-sm text-center mt-3 font-medium">
                No laptops registered or cleared by your profile yet today.
              </Text>
            </View>
          ) : (
            logs.map((log: any, index: number) => {
              const isCheckIn = log.action_type === "CHECK_IN";
              const isCheckOut = log.action_type === "CHECK_OUT";

              return (
                <View 
                  key={log.id || index} 
                  className="bg-[#111A2E] border border-slate-800/80 rounded-2xl p-4 mb-3 flex-row justify-between items-center"
                >
                  <View className="flex-1 pr-3">
                    <Text className="text-white font-bold text-base truncate">
                      {log.laptop_brand || "Hardware"} • <Text className="text-[#3B82F6] font-mono text-sm">{log.laptop_serial || "Device"}</Text>
                    </Text>
                    
                    <Text className="text-gray-400 text-xs mt-1">
                      Carrier: <Text className="text-gray-200 font-semibold">{log.student_name || "Student"}</Text>
                    </Text>

                    <View className="flex-row items-center mt-2">
                      <Ionicons name="time-outline" size={12} color="#64748B" />
                      <Text className="text-slate-500 font-mono text-xs ml-1">
                        {formatTime(log.created_at)}
                      </Text>
                    </View>
                  </View>

                  <View className={`px-3 py-1.5 rounded-xl border ${
                    isCheckIn ? 'bg-emerald-950/40 border-emerald-500/20' : 
                    isCheckOut ? 'bg-amber-950/40 border-amber-500/20' : 
                    'bg-purple-950/40 border-purple-500/20'
                  }`}>
                    <Text className={`text-xs font-black tracking-wide ${
                      isCheckIn ? 'text-emerald-400' : 
                      isCheckOut ? 'text-amber-400' : 
                      'text-purple-400'
                    }`}>
                      {isCheckIn ? "IN" : isCheckOut ? "OUT" : log.action_type}
                    </Text>
                  </View>
                </View>
              );
            })
          )}

          <View className="h-12" />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
