import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import { useRouter } from "expo-router";

import {
  getMyLaptop,
  searchStudent,
  transferLaptop,
} from "@/services/studentService";

export default function TransferLaptop() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [transferring, setTransferring] = useState(false);

  const [laptop, setLaptop] = useState<any>(null);
  const [query, setQuery] = useState("");
  const [students, setStudents] = useState<any[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);

  useEffect(() => {
    loadLaptop();
  }, []);

  useEffect(() => {
    if (query.trim().length > 0) {
      handleSearch(query);
    } else {
      setStudents([]);
    }
  }, [query]);

  const loadLaptop = async () => {
    try {
      setLoading(true);
      const data = await getMyLaptop();
      setLaptop(data);
    } catch {
      Toast.show({
        type: "error",
        text1: "Failed to load laptop details",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (text: string) => {
    try {
      const results = await searchStudent(text);

      const filtered = results.filter(
        (student: any) => student.id !== laptop?.current_holder_id
      );

      setStudents(filtered);
    } catch {
      console.log("Search parameters execution failed");
    }
  };

  const handleTransfer = async () => {
    if (!selectedStudent) {
      Toast.show({
        type: "error",
        text1: "Select a student first",
      });
      return;
    }

    try {
      setTransferring(true);
      await transferLaptop(laptop.id, selectedStudent.id);

      Toast.show({
        type: "success",
        text1: "Transfer Successful",
        text2: `Now held by ${selectedStudent.first_name}`,
      });

      await loadLaptop();
      setSelectedStudent(null);
      setQuery("");
      setStudents([]);
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Transfer Failed",
        text2: error?.error || "Verify custody validation status",
      });
    } finally {
      setTransferring(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-[#0B1220] justify-center items-center">
        <ActivityIndicator size="large" color="#3B82F6" />
      </SafeAreaView>
    );
  }

  const isOwnerHolding = laptop?.owner_id === laptop?.current_holder_id;

  return (
    <SafeAreaView className="flex-1 bg-[#0B1220]">
      
      <View className="px-5 pt-6 flex-row items-center mb-5">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back-circle" size={34} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-2xl font-bold ml-3">
          Transfer Laptop
        </Text>
      </View>

      <FlatList
        data={students}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: 60,
        }}
        ListEmptyComponent={
          query.trim().length > 0 ? (
            <View className="bg-[#111A2E] p-6 rounded-3xl items-center border border-slate-800">
              <Text className="text-slate-400 text-center">No student results match your search.</Text>
            </View>
          ) : null
        }
        ListHeaderComponent={
          <>
            <View className="bg-[#111A2E] rounded-3xl p-5 mb-5 border border-slate-800">
              <View className="flex-row items-center mb-4">
                <Ionicons name="laptop" size={28} color="#3B82F6" />
                <View className="ml-3">
                  <Text className="text-white text-xl font-bold">{laptop?.brand}</Text>
                  <Text className="text-slate-400 font-medium">{laptop?.serial_number}</Text>
                </View>
              </View>

              <View className="flex-row items-center mb-2">
                <Ionicons name="shield-checkmark" size={18} color="#22C55E" />
                <Text className="text-slate-400 text-sm ml-2">Owner:</Text>
                <Text className="text-white font-bold ml-2">{laptop?.owner_name}</Text>
              </View>

              <View className="flex-row items-center mb-2">
                <Ionicons name="swap-horizontal" size={18} color="#3B82F6" />
                <Text className="text-slate-400 text-sm ml-2">Current Holder:</Text>
                <Text className="text-white font-bold ml-2">{laptop?.current_holder_name}</Text>
              </View>

              <View className="mt-3">
                {isOwnerHolding ? (
                  <View className="bg-emerald-950 px-3 py-1.5 rounded-xl border border-emerald-500/20 align-start self-start">
                    <Text className="text-emerald-400 font-bold text-xs">✔ Currently with Owner</Text>
                  </View>
                ) : (
                  <View className="bg-amber-950 px-3 py-1.5 rounded-xl border border-amber-500/20 align-start self-start">
                    <Text className="text-amber-400 font-bold text-xs">⚠ Held by {laptop?.current_holder_name}</Text>
                  </View>
                )}
              </View>
            </View>

            <Text className="text-white text-lg font-bold mb-3">Search Recipient</Text>
            <View className="bg-[#111A2E] rounded-2xl flex-row items-center px-4 mb-5 border border-slate-800">
              <Ionicons name="search" size={20} color="#94A3B8" />
              <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder="Type student name or ID..."
                placeholderTextColor="#64748B"
                className="flex-1 text-white p-4 font-medium"
              />
            </View>

            {selectedStudent && (
              <View className="bg-blue-950/40 border border-blue-500/40 rounded-3xl p-5 mb-5">
                <Text className="text-blue-400 font-bold text-sm mb-2 uppercase tracking-wider">Selected Recipient</Text>
                <Text className="text-white font-bold text-lg">
                  {selectedStudent.first_name} {selectedStudent.last_name}
                </Text>
                <Text className="text-slate-300 text-sm mt-1">ID: {selectedStudent.student_id}</Text>
                <Text className="text-slate-400 text-xs mt-0.5">{selectedStudent.email}</Text>
              </View>
            )}
          </>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => setSelectedStudent(item)}
            activeOpacity={0.7}
            className={`p-4 rounded-2xl mb-3 flex-row items-center justify-between border ${
              selectedStudent?.id === item.id
                ? "bg-blue-900/40 border-blue-500"
                : "bg-[#111A2E] border-slate-800/40"
            }`}
          >
            <View className="flex-row items-center flex-1">
              <View className="bg-blue-500/10 w-11 h-11 rounded-full items-center justify-center border border-blue-500/20">
                <Ionicons name="person" size={20} color="#3B82F6" />
              </View>
              <View className="ml-4 flex-1">
                <Text className="text-white font-bold text-base">
                  {item.first_name} {item.last_name}
                </Text>
                <Text className="text-slate-400 text-xs mt-0.5">ID: {item.student_id}</Text>
              </View>
            </View>
            {selectedStudent?.id === item.id && (
              <Ionicons name="checkmark-circle" size={24} color="#3B82F6" />
            )}
          </TouchableOpacity>
        )}
        ListFooterComponent={
          selectedStudent ? (
            <TouchableOpacity
              disabled={transferring}
              onPress={handleTransfer}
              activeOpacity={0.8}
              className="bg-blue-500 p-4 rounded-2xl mt-4 flex-row justify-center items-center shadow-lg shadow-blue-500/30"
            >
              {transferring ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <>
                  <Ionicons name="swap-horizontal" size={20} color="white" />
                  <Text className="text-white font-bold ml-2 text-base">Confirm Custody Transfer</Text>
                </>
              )}
            </TouchableOpacity>
          ) : null
        }
      />
    </SafeAreaView>
  );
}
