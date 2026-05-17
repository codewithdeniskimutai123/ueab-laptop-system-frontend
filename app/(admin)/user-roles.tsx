import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import { adminGetUsersList, adminModifyUserRole} from "@/services/adminService";

export default function UserRolesScreen() {
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [selectedRole, setSelectedRole] = useState<"student" | "security" | "administrator" | null>(null);
  const [submittingId, setSubmittingId] = useState<number | null>(null);

  useEffect(() => {
    fetchDirectory();
  }, []);

  const fetchDirectory = async (clearQuery = false) => {
    try {
      setLoading(true);
      const res = await adminGetUsersList();
      const userList = res.data?.results ?? res.data ?? [];
      
      setUsers(userList);
      
      const activeQuery = clearQuery ? "" : searchQuery;
      
      if (!activeQuery.trim()) {
        setFilteredUsers(userList);
      } else {
        const query = activeQuery.toLowerCase();
        const updatedFiltered = userList.filter((u: any) => 
          u.username?.toLowerCase().includes(query) ||
          u.first_name?.toLowerCase().includes(query) ||
          u.last_name?.toLowerCase().includes(query) ||
          u.student_id?.toLowerCase().includes(query)
        );
        setFilteredUsers(updatedFiltered);
      }
    } catch (err) {
      console.log("FETCH ROLES ERROR:", err);
      Toast.show({ type: "error", text1: "Failed to download database roster" });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    if (!text.trim()) {
      setFilteredUsers(users);
      return;
    }
    const query = text.toLowerCase();
    const filtered = users.filter((u) => {
      return (
        u.username?.toLowerCase().includes(query) ||
        u.first_name?.toLowerCase().includes(query) ||
        u.last_name?.toLowerCase().includes(query) ||
        u.student_id?.toLowerCase().includes(query)
      );
    });
    setFilteredUsers(filtered);
  };

  const handleEditClick = (item: any) => {
    setEditingUserId(editingUserId === item.id ? null : item.id);
    const visualRoleString = item.role === "admin" ? "administrator" : item.role || "student";
    setSelectedRole(visualRoleString);
  };

  const handleRoleChange = async (userId: number) => {
    if (!selectedRole) return;
    setSubmittingId(userId);
    try {
      const backendPayloadRole = selectedRole === "administrator" ? "admin" : selectedRole;
      await adminModifyUserRole(userId, backendPayloadRole);
      
      Toast.show({
        type: "success",
        text1: "Access Authorization Saved",
        text2: `Account successfully mapped to ${selectedRole.toUpperCase()} privilege tier.`
      });
      
      setEditingUserId(null); 
      setSearchQuery("");
      await fetchDirectory(true);
    } catch (err: any) {
      console.log("ROLE CONVERSION FAULT:", err);
      const errReason = err?.response?.data?.error || err?.response?.data?.detail || "Failed to modify permission level.";
      Alert.alert("Action Terminated", errReason);
    } finally {
      setSubmittingId(null);
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
          <Text className="text-white text-2xl font-bold tracking-tight">Access Control</Text>
          <Text className="text-gray-400 text-xs mt-0.5">Manage permissions & staff roles</Text>
        </View>
      </View>

      <View className="px-5 mb-4">
        <View className="bg-[#111A2E] rounded-2xl border border-slate-800 flex-row items-center px-4">
          <Ionicons name="search-outline" size={18} color="#475569" />
          <TextInput
            value={searchQuery}
            onChangeText={handleSearch}
            placeholder="Search account name, username, or ID..."
            placeholderTextColor="#475569"
            autoCapitalize="none"
            className="flex-1 text-white p-4 font-medium text-sm text-left"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => handleSearch("")}>
              <Ionicons name="close-circle" size={18} color="#475569" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {loading && !submittingId ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#3B82F6" />
        </View>
      ) : (
        <ScrollView className="px-5" showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          
          <Text className="text-slate-400 text-xs font-black tracking-widest uppercase mb-3 px-1">
            System Records Profiles ({filteredUsers.length})
          </Text>

          {filteredUsers.length === 0 ? (
            <View className="bg-[#111A2E]/40 border border-dashed border-slate-800 rounded-3xl p-8 items-center mt-4">
              <Ionicons name="people-outline" size={40} color="#475569" />
              <Text className="text-gray-400 text-xs text-center mt-3 font-medium">No system users match your query parameters.</Text>
            </View>
          ) : (
            filteredUsers.map((item) => {
              const isEditing = editingUserId === item.id;
              const currentRoleDisplay = item.role === "admin" ? "administrator" : item.role || "student";

              return (
                <View key={item.id} className="bg-[#111A2E] border border-slate-800/80 rounded-2xl p-4 mb-3 shadow-md">
                  
                  <View className="flex-row justify-between items-center">
                    <View className="flex-1 mr-2">
                      <Text className="text-white font-bold text-base">
                        {item.first_name || ""} {item.last_name || "User"}
                      </Text>
                      <Text className="text-slate-400 text-xs">@{item.username || "unknown"}</Text>
                      
                      <View className="mt-1.5 self-start px-2 py-0.5 rounded bg-slate-800 border border-slate-700/60">
                        <Text className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">
                          {currentRoleDisplay}
                        </Text>
                      </View>
                    </View>

                    <View className="flex-row items-center">
                      <TouchableOpacity onPress={() => handleEditClick(item)} className="p-2.5 bg-slate-800 rounded-xl mr-2">
                        <Ionicons name={isEditing ? "close-outline" : "create-outline"} size={18} color="white" />
                      </TouchableOpacity>
                      
                    
                    </View>
                  </View>

                  {isEditing && (
                    <View className="mt-4 pt-4 border-t border-slate-800">
                      <Text className="text-slate-400 text-xs font-bold mb-2">Assign Access Level:</Text>
                      <View className="flex-row justify-between mb-3">
                        {(["student", "security", "administrator"] as const).map((roleOption) => (
                          <TouchableOpacity
                            key={roleOption}
                            onPress={() => setSelectedRole(roleOption)}
                            className={`px-3 py-2 rounded-xl border flex-1 mx-0.5 items-center ${
                              selectedRole === roleOption ? "bg-blue-600 border-blue-500" : "bg-slate-800/50 border-slate-700"
                            }`}
                          >
                            <Text className="text-white text-xs capitalize font-medium">{roleOption}</Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                      
                      <TouchableOpacity
                        onPress={() => handleRoleChange(item.id)}
                        disabled={submittingId === item.id}
                        className="bg-blue-500 py-2.5 rounded-xl items-center flex-row justify-center"
                      >
                        {submittingId === item.id ? (
                          <ActivityIndicator size="small" color="white" />
                        ) : (
                          <Text className="text-white font-bold text-xs">Save Role Settings</Text>
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
