import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { getRecentLogs } from "@/services/securityService";

export default function RecentLogsScreen() {
  const router = useRouter();
  const [allLogs, setAllLogs] = useState<any[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<any[]>([]);
  const [activeFilter, setActiveFilter] = useState<"ALL" | "CHECK_IN" | "CHECK_OUT">("ALL");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchLogs();
  }, []);

  useEffect(() => {
    if (activeFilter === "ALL") {
      setFilteredLogs(allLogs);
    } else {
      setFilteredLogs(allLogs.filter((log) => log.action_type === activeFilter));
    }
  }, [activeFilter, allLogs]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await getRecentLogs();
      setAllLogs(res.data || []);
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
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    } catch (e) {
      return "Just Now";
    }
  };

  const checkInCount = allLogs.filter(log => log.action_type === "CHECK_IN").length;
  const checkOutCount = allLogs.filter(log => log.action_type === "CHECK_OUT").length;

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

      {loading && !refreshing ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#3B82F6" />
        </View>
      ) : (
        <ScrollView 
          className="px-5"
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#3B82F6" colors={["#3B82F6"]} />
          }
        >
          
          <Text className="text-xs font-black tracking-widest uppercase mb-3 text-slate-400">
            Filter Log Streams
          </Text>
          
          <View className="flex-row justify-between mb-6">
            
            <TouchableOpacity
              onPress={() => setActiveFilter("ALL")}
              activeOpacity={0.8}
              className={`w-[31%] p-3 rounded-2xl border items-center justify-between min-h-[90px] ${
                activeFilter === "ALL" ? "bg-blue-600/10 border-blue-500 shadow-md" : "bg-[#111A2E] border-slate-800"
              }`}
            >
              <Ionicons name="apps-outline" size={20} color={activeFilter === "ALL" ? "#3B82F6" : "#64748B"} />
              <Text className="text-white font-bold text-[11px] mt-1 text-center">All Audits</Text>
              <View className="bg-slate-800 px-2 py-0.5 rounded-md mt-1">
                <Text className="text-white font-bold text-[10px] font-mono">{allLogs.length}</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setActiveFilter("CHECK_IN")}
              activeOpacity={0.8}
              className={`w-[31%] p-3 rounded-2xl border items-center justify-between min-h-[90px] ${
                activeFilter === "CHECK_IN" ? "bg-emerald-600/10 border-emerald-500 shadow-md" : "bg-[#111A2E] border-slate-800"
              }`}
            >
              <Ionicons name="log-in-outline" size={20} color={activeFilter === "CHECK_IN" ? "#10B981" : "#64748B"} />
              <Text className="text-white font-bold text-[11px] mt-1 text-center">Check In</Text>
              <View className="bg-slate-800 px-2 py-0.5 rounded-md mt-1">
                <Text className="text-emerald-400 font-bold text-[10px] font-mono">{checkInCount}</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setActiveFilter("CHECK_OUT")}
              activeOpacity={0.8}
              className={`w-[31%] p-3 rounded-2xl border items-center justify-between min-h-[90px] ${
                activeFilter === "CHECK_OUT" ? "bg-amber-600/10 border-amber-500 shadow-md" : "bg-[#111A2E] border-slate-800"
              }`}
            >
              <Ionicons name="log-out-outline" size={20} color={activeFilter === "CHECK_OUT" ? "#F59E0B" : "#64748B"} />
              <Text className="text-white font-bold text-[11px] mt-1 text-center">Check Out</Text>
              <View className="bg-slate-800 px-2 py-0.5 rounded-md mt-1">
                <Text className="text-amber-400 font-bold text-[10px] font-mono">{checkOutCount}</Text>
              </View>
            </TouchableOpacity>

          </View>

          <Text className="text-xs font-black tracking-widest uppercase mb-3 text-slate-400">
            {activeFilter === "ALL" ? "Full Stream" : activeFilter === "CHECK_IN" ? "Check In Stream" : "Check Out Stream"}
          </Text>
          
          {filteredLogs.length === 0 ? (
            <View className="bg-[#111A2E]/40 border border-dashed border-slate-800 rounded-3xl p-8 items-center justify-center mt-2">
              <Ionicons name="document-text-outline" size={36} color="#475569" />
              <Text className="text-gray-400 text-xs text-center mt-3 font-medium">
                No matching laptop entries found under this status.
              </Text>
            </View>
          ) : (
            filteredLogs.map((log: any, index: number) => {
              const isCheckIn = log.action_type === "CHECK_IN";
              const isCheckOut = log.action_type === "CHECK_OUT";

              return (
                <View 
                  key={log.id || index} 
                  className="bg-[#111A2E] border border-slate-800/80 rounded-2xl p-4 mb-3 flex-row justify-between items-center shadow-sm"
                >
                  <View className="flex-1 pr-3">
                    <Text className="text-white font-bold text-base tracking-tight">
                      {log.laptop_brand || "UNKNOWN DEVICE"} • <Text className="text-[#3B82F6] font-mono text-sm">{log.laptop_serial || "N/A"}</Text>
                    </Text>
                    
                    <Text className="text-gray-400 text-xs mt-1.5 font-medium">
                      Officer in Charge: <Text className="text-slate-200 font-semibold">{log.scanned_by_name || "System Assigned"}</Text>
                    </Text>

                    <View className="flex-row items-center mt-2.5">
                      <Ionicons name="time-outline" size={13} color="#64748B" />
                      <Text className="text-slate-500 font-mono text-xs ml-1.5">
                        Logged at {formatTime(log.created_at)}
                      </Text>
                    </View>
                  </View>

                  <View className={`px-3 py-2 rounded-xl border ${
                    isCheckIn ? 'bg-emerald-950/40 border-emerald-500/20' : 
                    isCheckOut ? 'bg-amber-950/40 border-amber-500/20' : 
                    'bg-purple-950/40 border-purple-500/20'
                  }`}>
                    <Text className={`text-[10px] font-black tracking-widest uppercase ${
                      isCheckIn ? 'text-emerald-400' : 
                      isCheckOut ? 'text-amber-400' : 
                      'text-purple-400'
                    }`}>
                      {isCheckIn ? "CHECK IN" : isCheckOut ? "CHECK OUT" : log.action_type}
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
