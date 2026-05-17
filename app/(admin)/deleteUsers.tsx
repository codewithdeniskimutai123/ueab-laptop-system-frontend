import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import { adminGetUsersList, adminDeleteUser } from "@/services/adminService";

export default function DeleteUsersScreen() {
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  
  const [confirmTargetId, setConfirmTargetId] = useState<number | null>(null);

  useEffect(() => {
    fetchUsersDirectory();
  }, []);

  const fetchUsersDirectory = async (clearQuery = false) => {
    try {
      setLoading(true);
      const res = await adminGetUsersList();
      const userList = res.data?.results ?? res.data ?? [];
      setUsers(userList);
      
      const activeQuery = clearQuery ? "" : searchQuery;
      applySearchFilter(activeQuery, userList);
    } catch (err) {
      console.log("FETCH USERS DIRECTORY ERROR:", err);
      Toast.show({ 
        type: "error", 
        text1: "Connection Error", 
        text2: "Failed to download system user registry accounts." 
      });
    } finally {
      setLoading(false);
    }
  };

  const applySearchFilter = (text: string, fullList: any[]) => {
    if (!text.trim()) {
      setFilteredUsers(fullList);
      return;
    }
    const query = text.toLowerCase();
    const filtered = fullList.filter((u: any) => 
      u.username?.toLowerCase().includes(query) ||
      u.first_name?.toLowerCase().includes(query) ||
      u.last_name?.toLowerCase().includes(query) ||
      u.student_id?.toLowerCase().includes(query) ||
      u.email?.toLowerCase().includes(query)
    );
    setFilteredUsers(filtered);
  };

  const handleSearchTextChange = (text: string) => {
    setSearchQuery(text);
    applySearchFilter(text, users);
  };

  const toggleConfirmTray = (userId: number) => {
    setConfirmTargetId(confirmTargetId === userId ? null : userId);
  };

  const handleCancelAction = () => {
    setConfirmTargetId(null);
    setSearchQuery("");
    applySearchFilter("", users);
  };

  const executeUserDeletion = async (userId: number, username: string) => {
    setDeletingId(userId);
    try {
      const response = await adminDeleteUser(userId);
      const feedbackMessage = response.data?.success || `@${username} has been removed successfully.`;
      
      Toast.show({
        type: "success",
        text1: "Account Purged",
        text2: feedbackMessage
      });

      setConfirmTargetId(null);
      setSearchQuery("");
      await fetchUsersDirectory(true);
    } catch (err: any) {
      console.log("USER DELETION REJECTION ERROR:", err);
      const serverMessage = err?.response?.data?.error || "The removal transaction was rejected by system protocol.";
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
          <Text className="text-white text-2xl font-bold tracking-tight">Purge Accounts</Text>
          <Text className="text-red-400 text-xs mt-0.5">Permanently remove user registers</Text>
        </View>
      </View>

      <View className="px-5 mb-4">
        <View className="bg-[#111A2E] rounded-2xl border border-slate-800 flex-row items-center px-4">
          <Ionicons name="search-outline" size={18} color="#475569" />
          <TextInput
            value={searchQuery}
            onChangeText={handleSearchTextChange}
            placeholder="Search username, ID, name, or email..."
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

      {loading && users.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#EF4444" />
        </View>
      ) : (
        <ScrollView className="px-5" showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          
          <Text className="text-slate-400 text-xs font-black tracking-widest uppercase mb-3 px-1">
            Active Accounts Registered ({filteredUsers.length})
          </Text>

          {filteredUsers.length === 0 ? (
            <View className="bg-[#111A2E]/40 border border-dashed border-slate-800 rounded-3xl p-8 items-center mt-4">
              <Ionicons name="people-outline" size={40} color="#475569" />
              <Text className="text-gray-400 text-xs text-center mt-3 font-medium">No account results match your query criteria.</Text>
            </View>
          ) : (
            filteredUsers.map((item) => {
              const isProcessingThisUser = deletingId === item.id;
              const isShowingConfirmTray = confirmTargetId === item.id;

              return (
                <View key={item.id} className="bg-[#111A2E] border border-slate-800/80 rounded-2xl p-4 mb-3 shadow-md">
                  
                  <View className="flex-row justify-between items-center">
                    <View className="flex-1 mr-4">
                      <Text className="text-white font-bold text-base">
                        {item.first_name || ""} {item.last_name || "User"}
                      </Text>
                      <Text className="text-yellow-950 font-bold text-base">
                        {item.role || "User"}
                      </Text>
                      <Text className="text-slate-400 text-xs font-semibold mb-2">@{item.username || "unknown"}</Text>
                      
                      <View className="space-y-1 pt-1.5 border-t border-slate-800/60">
                        <View className="flex-row items-center">
                          <Ionicons name="mail-outline" size={12} color="#64748B" style={{ marginRight: 6 }} />
                          <Text className="text-gray-400 text-xs select-all">{item.email || "No Email linked"}</Text>
                        </View>
                        
                        {item.student_id && (
                          <View className="flex-row items-center mt-1">
                            <Ionicons name="card-outline" size={12} color="#64748B" style={{ marginRight: 6 }} />
                            <Text className="text-gray-400 text-xs">ID: {item.student_id}</Text>
                          </View>
                        )}

                        {item.phone_number && (
                          <View className="flex-row items-center mt-1">
                            <Ionicons name="call-outline" size={12} color="#64748B" style={{ marginRight: 6 }} />
                            <Text className="text-gray-400 text-xs">{item.phone_number}</Text>
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
                        disabled={isProcessingThisUser}
                        className="bg-slate-800 py-2.5 px-4 rounded-xl flex-1 items-center justify-center border border-slate-700"
                      >
                        <Text className="text-slate-300 font-bold text-xs">Cancel</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => executeUserDeletion(item.id, item.username)}
                        disabled={isProcessingThisUser}
                        className="bg-red-600 py-2.5 px-4 rounded-xl flex-[2] items-center justify-center flex-row space-x-2 shadow-lg active:opacity-80"
                      >
                        {isProcessingThisUser ? (
                          <ActivityIndicator size="small" color="white" />
                        ) : (
                          <>
                            <Ionicons name="checkmark-circle-outline" size={16} color="white" style={{ marginRight: 4 }} />
                            <Text className="text-white font-black text-xs uppercase tracking-wider">Confirm Delete User</Text>
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
