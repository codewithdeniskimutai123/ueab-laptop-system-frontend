import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import { adminGetLaptopsList, adminDeleteLaptop } from "@/services/adminService";

export default function DeleteLaptopsScreen() {
  const router = useRouter();
  const [laptops, setLaptops] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredLaptops, setFilteredLaptops] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  
  const [confirmTargetId, setConfirmTargetId] = useState<number | null>(null);

  useEffect(() => {
    fetchLaptopsDirectory();
  }, []);

  const fetchLaptopsDirectory = async (clearQuery = false) => {
    try {
      setLoading(true);
      const res = await adminGetLaptopsList();
      console.log(res.data)
      const hardwareList = res.data?.results ?? res.data ?? [];
      setLaptops(hardwareList);
      
      const activeQuery = clearQuery ? "" : searchQuery;
      applySearchFilter(activeQuery, hardwareList);
    } catch (err) {
      console.log("FETCH LAPTOPS DIRECTORY ERROR:", err);
      Toast.show({ 
        type: "error", 
        text1: "Connection Error", 
        text2: "Failed to download system hardware inventory registries." 
      });
    } finally {
      setLoading(false);
    }
  };

  const applySearchFilter = (text: string, fullList: any[]) => {
    if (!text.trim()) {
      setFilteredLaptops(fullList);
      return;
    }
    const query = text.toLowerCase();
    const filtered = fullList.filter((l: any) => 
      l.brand?.toLowerCase().includes(query) ||
      l.serial_number?.toLowerCase().includes(query) ||
      l.owner?.username?.toLowerCase().includes(query) ||
      l.owner?.first_name?.toLowerCase().includes(query) ||
      l.owner?.last_name?.toLowerCase().includes(query)
    );
    setFilteredLaptops(filtered);
  };

  const handleSearchTextChange = (text: string) => {
    setSearchQuery(text);
    applySearchFilter(text, laptops);
  };

  const toggleConfirmTray = (laptopId: number) => {
    setConfirmTargetId(confirmTargetId === laptopId ? null : laptopId);
  };

  const handleCancelAction = () => {
    setConfirmTargetId(null);
    setSearchQuery("");
    applySearchFilter("", laptops);
  };

  const executeLaptopDeletion = async (laptopId: number, serialNumber: string) => {
    setDeletingId(laptopId);
    try {
      const response = await adminDeleteLaptop(laptopId);
      const feedbackMessage = response.data?.success || `Serial Number '${serialNumber}' has been removed from inventory registers.`;
      
      Toast.show({
        type: "success",
        text1: "Asset Purged",
        text2: feedbackMessage
      });

      setConfirmTargetId(null);
      setSearchQuery("");
      await fetchLaptopsDirectory(true);
    } catch (err: any) {
      console.log("LAPTOP DELETION REJECTION ERROR:", err);
      const serverMessage = err?.response?.data?.error || "The removal request was rejected by system inventory parameters.";
      Alert.alert("Operation Failed", serverMessage);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#0B1220]">
      
      <View className="flex-row items-center px-5 pt-4 mb-4">
        <TouchableOpacity 
          onPress={() => router.replace("/(admin)")} 
          className="bg-[#111A2E] p-2.5 rounded-full border border-slate-800 mr-4"
        >
          <Ionicons name="arrow-back-outline" size={22} color="white" />
        </TouchableOpacity>
        <View>
          <Text className="text-white text-2xl font-bold tracking-tight">Wipe Hardware Registry</Text>
          <Text className="text-red-400 text-xs mt-0.5">Permanently remove computing assets</Text>
        </View>
      </View>

      <View className="px-5 mb-4">
        <View className="bg-[#111A2E] rounded-2xl border border-slate-800 flex-row items-center px-4">
          <Ionicons name="search-outline" size={18} color="#475569" />
          <TextInput
            value={searchQuery}
            onChangeText={handleSearchTextChange}
            placeholder="Search brand, serial code, or holder name..."
            placeholderTextColor="#475569"
            autoCapitalize="none"
            className="flex-1 text-white p-4 font-medium text-sm text-left"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => handleSearchTextChange("")}>
              <Ionicons name="close-circle" size={18} color="#475569" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {loading && laptops.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#EF4444" />
        </View>
      ) : (
        <ScrollView className="px-5" showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          
          <Text className="text-slate-400 text-xs font-black tracking-widest uppercase mb-3 px-1">
            Registered Assets List ({filteredLaptops.length})
          </Text>

          {filteredLaptops.length === 0 ? (
            <View className="bg-[#111A2E]/40 border border-dashed border-slate-800 rounded-3xl p-8 items-center mt-4">
              <Ionicons name="laptop-outline" size={40} color="#475569" />
              <Text className="text-gray-400 text-xs text-center mt-3 font-medium">No computing assets match your inventory query.</Text>
            </View>
          ) : (
            filteredLaptops.map((item) => {
              const isProcessingThisLaptop = deletingId === item.id;
              const isShowingConfirmTray = confirmTargetId === item.id;

              return (
                <View key={item.id} className="bg-[#111A2E] border border-slate-800/80 rounded-2xl p-4 mb-3 shadow-md">
                  
                  <View className="flex-row justify-between items-center">
                    <View className="flex-1 mr-4">
                      <Text className="text-white font-bold text-base uppercase">
                        {item.brand || "Generic Asset"}
                      </Text>
                      <Text className="text-blue-400 text-xs font-mono select-all">S/N: {item.serial_number || "unknown"}</Text>
                      
                      <View className="space-y-1 pt-1.5 mt-2 border-t border-slate-800/60">
                        {item.owner && (
                          <View className="flex-row items-center">
                            <Ionicons name="person-outline" size={12} color="#64748B" style={{ marginRight: 6 }} />
                            <Text className="text-gray-400 text-xs">
                              Owner: {item.owner.first_name || ""} {item.owner.last_name || ""} (@{item.owner.username})
                            </Text>
                          </View>
                        )}
                        
                        {item.current_holder && item.current_holder.id !== item.owner?.id && (
                          <View className="flex-row items-center mt-1">
                            <Ionicons name="swap-horizontal-outline" size={12} color="#EAB308" style={{ marginRight: 6 }} />
                            <Text className="text-amber-400 text-xs">
                              Temporary Custody: {item.current_holder.first_name || ""}
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>

                    <TouchableOpacity
                      onPress={() => toggleConfirmTray(item.id)}
                      disabled={deletingId !== null}
                      className={`p-3 rounded-2xl justify-center items-center h-12 w-12 ${
                        isShowingConfirmTray ? "bg-amber-500/20 border border-amber-500/30" : "bg-red-950/30 border border-red-900/30"
                      }`}
                    >
                      <Ionicons 
                        name={isShowingConfirmTray ? "close-outline" : "trash-outline"} 
                        size={20} 
                        color={isShowingConfirmTray ? "#F59E0B" : "#EF4444"} 
                      />
                    </TouchableOpacity>
                  </View>

                  {isShowingConfirmTray && (
                    <View className="mt-4 pt-4 border-t border-slate-800 flex-row space-x-2">
                      <TouchableOpacity
                        onPress={handleCancelAction}
                        disabled={isProcessingThisLaptop}
                        className="bg-slate-800 py-2.5 px-4 rounded-xl flex-1 items-center justify-center border border-slate-700"
                      >
                        <Text className="text-slate-300 font-bold text-xs">Cancel</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => executeLaptopDeletion(item.id, item.serial_number)}
                        disabled={isProcessingThisLaptop}
                        className="bg-red-600 py-2.5 px-4 rounded-xl flex-1 items-center justify-center flex-row space-x-2 shadow-lg active:opacity-80"
                      >
                        {isProcessingThisLaptop ? (
                          <ActivityIndicator size="small" color="white" />
                        ) : (
                          <>
                            <Ionicons name="alert-circle-outline" size={16} color="white" style={{ marginRight: 4 }} />
                            <Text className="text-white font-black text-xs uppercase tracking-wider">Confirm Delete Laptop</Text>
                          </>
                        )}
                      </TouchableOpacity>
                    </View>
                  )}

                </View>
              );
            })
          )}
        </ScrollView>
      )}
      <Toast />
    </SafeAreaView>
  );
}
