import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, RefreshControl } from "react-native";
import { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { getAdminAnalytics } from "@/services/adminService";
import LogoutButton from "@/components/LogoutButton";

export default function AdminDashboardHome() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [timeFilter, setTimeFilter] = useState<"day" | "week" | "month" | "year">("day");

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const res = await getAdminAnalytics();
      setData(res.data);
    } catch (err) {
      console.log("ADMIN ANALYTICS ERROR:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadAnalytics();
  };

  if (loading && !refreshing) {
    return (
      <View className="flex-1 bg-[#0B1220] justify-center items-center">
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  const getTimelineMetric = () => {
    if (!data?.laptops) return 0;
    if (timeFilter === "day") return data.laptops.active_today;
    if (timeFilter === "week") return data.laptops.active_week;
    if (timeFilter === "month") return data.laptops.active_month;
    return data.laptops.active_year;
  };

  return (
    <View className="flex-1 bg-[#0B1220] px-5 pt-6">
      <ScrollView 
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#3B82F6" />}
      >
        
        <View className="flex-row justify-between items-center mb-6">
          <View>
            <Text className="text-white text-3xl font-bold">Admin Dashboard</Text>
            <Text className="text-gray-400 mt-1 text-sm">Manage users, laptops & system logs</Text>
          </View>
          <View className="bg-red-500/10 px-3 py-1.5 rounded-xl border border-red-500/20">
            <Text className="text-red-400 text-xs font-bold uppercase tracking-wider">Root</Text>
          </View>
        </View>

        <View className="bg-[#111A2E] border border-slate-800 rounded-3xl p-5 mb-5 shadow-xl">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-white text-base font-bold">Active Laptop Logs</Text>
            <Ionicons name="time-outline" size={20} color="#3B82F6" />
          </View>
          <View className="flex-row items-baseline mb-4">
            <Text className="text-white text-3xl font-black font-mono">{getTimelineMetric()}</Text>
            <Text className="text-slate-500 text-xs font-bold ml-2 uppercase tracking-wide">Scans</Text>
          </View>
          <View className="flex-row justify-between bg-[#0B1220] p-1 rounded-xl border border-slate-800">
            {["day", "week", "month", "year"].map((filter: any) => (
              <TouchableOpacity
                key={filter}
                onPress={() => setTimeFilter(filter)}
                className={`flex-1 py-2 rounded-lg items-center ${timeFilter === filter ? 'bg-blue-600' : 'bg-transparent'}`}
              >
                <Text className={`text-[10px] font-black uppercase ${timeFilter === filter ? 'text-white' : 'text-slate-400'}`}>
                  {filter}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View className="flex-row justify-between mb-5">
          <View className="bg-[#111A2E] w-[48%] p-4 rounded-2xl border border-slate-800">
            <Text className="text-gray-400 text-xs font-bold uppercase">Total Users</Text>
            <Text className="text-white text-2xl font-black mt-2 font-mono">{data?.users?.total || 0}</Text>
            <Text className="text-slate-500 text-[10px] mt-0.5">{data?.users?.students || 0} Students</Text>
          </View>
          <View className="bg-[#111A2E] w-[48%] p-4 rounded-2xl border border-slate-800">
            <Text className="text-gray-400 text-xs font-bold uppercase">Guard Crew</Text>
            <Text className="text-white text-2xl font-black mt-2 font-mono">{data?.users?.security || 0}</Text>
            <Text className="text-slate-500 text-[10px] mt-0.5">Active Staff</Text>
          </View>
        </View>

        <Text className="text-slate-400 text-xs font-black tracking-widest uppercase mb-3 px-1">Brands Stock</Text>
        <View className="bg-[#111A2E] border border-slate-800 rounded-2xl p-4 mb-5">
          {!data?.laptops?.by_brand || data.laptops.by_brand.length === 0 ? (
            <Text className="text-gray-500 text-xs font-medium py-1">No registered equipment rows found.</Text>
          ) : (
            <View className="flex-row flex-wrap justify-between">
              {data.laptops.by_brand.map((item: any, idx: number) => (
                <View key={idx} className="w-[48%] bg-[#0B1220] p-2.5 rounded-xl border border-slate-800/80 mb-2 flex-row justify-between items-center">
                  <Text className="text-white text-xs font-bold uppercase">{item.brand}</Text>
                  <Text className="text-[#3B82F6] font-black text-xs font-mono">{item.count}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        <Text className="text-slate-400 text-xs font-black tracking-widest uppercase mb-3 px-1">Global Audit Ledger Metrics</Text>
        <View className="bg-[#111A2E] border border-slate-800 rounded-2xl p-4 mb-5">
          <View className="flex-row justify-between items-center border-b border-slate-800/60 pb-2.5 mb-2.5">
            <Text className="text-slate-300 font-medium text-xs">Total Check-Ins</Text>
            <Text className="text-emerald-400 font-bold font-mono text-sm">{data?.transactions?.check_ins || 0}</Text>
          </View>
          <View className="flex-row justify-between items-center border-b border-slate-800/60 pb-2.5 mb-2.5">
            <Text className="text-slate-300 font-medium text-xs">Total Check-Outs</Text>
            <Text className="text-amber-400 font-bold font-mono text-sm">{data?.transactions?.check_outs || 0}</Text>
          </View>
          <View className="flex-row justify-between items-center">
            <Text className="text-slate-300 font-medium text-xs">Temporary Student Transfers</Text>
            <Text className="text-purple-400 font-bold font-mono text-sm">{data?.transactions?.transfers || 0}</Text>
          </View>
        </View>

        <Text className="text-slate-400 text-xs font-black tracking-widest uppercase mb-3 px-1">System Utilities</Text>
        <View className="mb-8 space-y-3">
          
          <TouchableOpacity
            onPress={() => router.push("/(admin)/register-laptop")}
            className="bg-[#111A2E] border border-slate-800 p-4 rounded-xl flex-row items-center justify-between mb-3"
          >
            <View className="flex-row items-center">
              <Ionicons name="add-circle-outline" size={20} color="#3B82F6" />
              <Text className="text-white font-bold ml-3 text-sm">Provision New Laptop</Text>
            </View>
            <Ionicons name="chevron-forward" size={14} color="#475569" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/(admin)/user-roles")}
            className="bg-[#111A2E] border border-slate-800 p-4 rounded-xl flex-row items-center justify-between mb-3"
          >
            <View className="flex-row items-center">
              <Ionicons name="shield-checkmark-outline" size={20} color="#10B981" />
              <Text className="text-white font-bold ml-3 text-sm">Manage User Roles</Text>
            </View>
            <Ionicons name="chevron-forward" size={14} color="#475569" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/(admin)/deleteUsers")}
            className="bg-[#111A2E] border border-slate-800 p-4 rounded-xl flex-row items-center justify-between mb-6"
          >
            <View className="flex-row items-center">
              <Ionicons name="trash-bin-outline" size={20} color="#EF4444" />
              <Text className="text-white font-bold ml-3 text-sm">Purge Registered Users</Text>
            </View>
            <Ionicons name="chevron-forward" size={14} color="#475569" />
          </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => router.push("/(admin)/deleteLaptops")}
                    className="bg-[#111A2E] border border-slate-800 p-4 rounded-xl flex-row items-center justify-between mb-6"
                  >
                    <View className="flex-row items-center">
                      <Ionicons name="laptop-outline" size={20} color="#EF4444" />
                      <Text className="text-white font-bold ml-3 text-sm">Purge Laptop Registries</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={14} color="#475569" />
                  </TouchableOpacity>
          <LogoutButton />
          
        </View>
      </ScrollView>
    </View>
  );
}
