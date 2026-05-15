import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import { useRouter } from "expo-router";
import { getMyTransactions } from "@/services/studentService";

type FilterType = "ALL" | "TRANSFER" | "SCAN" | "CHECK_IN" | "CHECK_OUT";

export default function Transactions() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [filter, setFilter] = useState<FilterType>("ALL");

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      const data = await getMyTransactions();
      setTransactions(data);
    } catch {
      Toast.show({
        type: "error",
        text1: "Failed to load transactions",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/(student)");
    }
  };

  const getFilteredData = () => {
    if (filter === "ALL") return transactions;
    return transactions.filter((t) => t.action_type === filter);
  };

  const getActionIcon = (type: string) => {
    switch (type) {
      case "TRANSFER":
        return "swap-horizontal-outline";
      case "CHECK_IN":
        return "log-in-outline";
      case "CHECK_OUT":
        return "log-out-outline";
      case "SCAN":
        return "scan-outline";
      default:
        return "ellipse-outline";
    }
  };

  const getActionColor = (type: string) => {
    switch (type) {
      case "TRANSFER":
        return "#3B82F6";
      case "CHECK_IN":
        return "#10B981";
      case "CHECK_OUT":
        return "#F59E0B";
      case "SCAN":
        return "#8B5CF6";
      default:
        return "#94A3B8";
    }
  };

  const FilterButton = ({ label, value }: { label: string; value: FilterType }) => {
    const active = filter === value;
    return (
      <TouchableOpacity
        onPress={() => setFilter(value)}
        className={`px-4 py-2 rounded-full mr-2 h-10 justify-center ${
          active ? "bg-blue-500" : "bg-[#111A2E]"
        }`}
      >
        <Text className={`font-semibold text-sm ${active ? "text-white" : "text-gray-300"}`}>
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-[#0B1220] justify-center items-center">
        <ActivityIndicator size="large" color="#3B82F6" />
      </SafeAreaView>
    );
  }

  const data = getFilteredData();

  return (
    <SafeAreaView className="flex-1 bg-[#0B1220]">
      
      <View className="px-5 pt-6 mb-4 flex-row items-center">
        <TouchableOpacity onPress={handleBack}>
          <Ionicons name="arrow-back" size={26} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-2xl font-bold ml-3">Transactions</Text>
      </View>

      <View className="h-14 mb-2">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, alignItems: 'center' }}
        >
          <FilterButton label="All" value="ALL" />
          <FilterButton label="Transfer" value="TRANSFER" />
          <FilterButton label="Scan" value="SCAN" />
          <FilterButton label="Check In" value="CHECK_IN" />
          <FilterButton label="Check Out" value="CHECK_OUT" />
        </ScrollView>
      </View>

      {data.length === 0 ? (
        <View className="flex-1 justify-center items-center px-6 mb-20">
          <Ionicons name="document-text-outline" size={80} color="#1E293B" />
          <Text className="text-white text-xl font-bold mt-4">No transactions found</Text>
          <Text className="text-gray-400 text-center mt-2 text-sm">
            No {filter.toLowerCase().replace('_', ' ')} activity available yet.
          </Text>
        </View>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingBottom: 40,
          }}
          renderItem={({ item }) => {
            const icon = getActionIcon(item.action_type);
            const color = getActionColor(item.action_type);

            return (
              <View className="bg-[#111A2E] p-5 rounded-2xl mb-4 border border-slate-800/40">
                <View className="flex-row justify-between items-center">
                  <View className="flex-row items-center">
                    <Ionicons name={icon as any} size={20} color={color} />
                    <Text className="text-white font-bold text-base ml-2">
                      {item.laptop_brand} Hardware
                    </Text>
                  </View>
                  <View
                    style={{ backgroundColor: color + "15" }}
                    className="px-3 py-1 rounded-full border border-slate-700/20"
                  >
                    <Text style={{ color: color }} className="text-xs font-extrabold uppercase tracking-wide">
                      {item.action_type.replace('_', ' ')}
                    </Text>
                  </View>
                </View>

                <Text className="text-gray-300 mt-3 text-sm leading-relaxed">
                  Device S/N: <Text className="text-white font-semibold">{item.laptop_serial}</Text> was successfully processed.
                </Text>

                <View className="mt-4 pt-3 border-t border-slate-800 flex-row justify-between items-center">
                  <Text className="text-gray-400 text-xs font-medium">
                    👤 Staff: {item.scanned_by_name || "System Base"}
                  </Text>
                  <Text className="text-gray-500 text-[11px]">
                    {new Date(item.created_at).toLocaleDateString("en-KE", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit"
                    })}
                  </Text>
                </View>
              </View>
            );
          }}
        />
      )}
    </SafeAreaView>
  );
}
