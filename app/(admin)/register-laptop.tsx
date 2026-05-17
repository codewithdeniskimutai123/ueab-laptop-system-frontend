import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import { adminRegisterLaptop, adminGetUsersList } from "@/services/adminService";

export default function RegisterLaptopScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetchingUsers, setFetchingUsers] = useState(true);

  const [usersDirectory, setUsersDirectory] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);

  const [brand, setBrand] = useState<"HP" | "DELL" | "LENOVO" | "APPLE" | "OTHER">("HP");
  const [serialNumber, setSerialNumber] = useState("");

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const res = await adminGetUsersList();
      const userList = res.data?.results ?? res.data ?? [];
      setUsersDirectory(userList);
    } catch (err) {
      console.log("USER REGISTERY FETCH ERROR:", err);
    } finally {
      setFetchingUsers(false);
    }
  };

  const handleSearchTextChange = (text: string) => {
    setSearchQuery(text);
    if (!text.trim()) {
      setFilteredUsers([]);
      return;
    }

    const query = text.toLowerCase();
    const filtered = usersDirectory.filter((u: any) => {
      const usernameMatch = u.username?.toLowerCase().includes(query);
      const firstNameMatch = u.first_name?.toLowerCase().includes(query);
      const lastNameMatch = u.last_name?.toLowerCase().includes(query);
      const idMatch = u.student_id?.toLowerCase().includes(query);
      return usernameMatch || firstNameMatch || lastNameMatch || idMatch;
    });

    setFilteredUsers(filtered);
  };

  const handleRegister = async () => {
    if (!selectedStudent) {
      Toast.show({
        type: "error",
        text1: "Owner Required",
        text2: "Please select a student from the live search list."
      });
      return;
    }
    if (!serialNumber.trim()) {
      Toast.show({
        type: "error",
        text1: "Input Required",
        text2: "Please input the device hardware serial number."
      });
      return;
    }

    setLoading(true);

    try {
      const payload = {
        owner: selectedStudent.id, 
        brand: brand,
        serial_number: serialNumber.trim().toUpperCase()
      };

      await adminRegisterLaptop(payload);
      
      Toast.show({
        type: "success",
        text1: "Registration Complete",
        text2: `Hardware successfully assigned to ${selectedStudent.username}.`,
        visibilityTime: 2500
      });

      setTimeout(() => {
        router.replace("/(admin)");
      }, 1000);

    } catch (err: any) {
      console.log("PROVISIONING LOG FAULT:", err);
      const backendErrors = err?.response?.data;
      
      if (backendErrors && typeof backendErrors === 'object') {
        const isDuplicate = Object.keys(backendErrors).some(key => 
          key.toLowerCase().includes("serial") || 
          JSON.stringify(backendErrors[key]).toLowerCase().includes("already exists") ||
          JSON.stringify(backendErrors[key]).toLowerCase().includes("already registered")
        );

        if (isDuplicate) {
          Toast.show({
            type: "error",
            text1: "Registration Failed",
            text2: `Laptop serial "${serialNumber.trim().toUpperCase()}" already exists.`
          });
        } else {
          const errorMsg = Object.entries(backendErrors)
            .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(", ") : value}`)
            .join("\n");
          Toast.show({
            type: "error",
            text1: "Provisioning Rejected",
            text2: errorMsg
          });
        }
      } else {
        Toast.show({
          type: "error",
          text1: "System Exception",
          text2: "Failed to compile registration. Check syntax."
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#0B1220]">
      <ScrollView className="px-5 pt-4" showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

        {/* HEADER */}
        <View className="flex-row items-center mb-5">
          <TouchableOpacity 
            onPress={() => router.replace("/(admin)")}
            className="bg-[#111A2E] p-2.5 rounded-full border border-slate-800 mr-4"
          >
            <Ionicons name="arrow-back-outline" size={22} color="white" />
          </TouchableOpacity>
          <View>
            <Text className="text-white text-2xl font-bold tracking-tight">Provision Hardware</Text>
            <Text className="text-gray-400 text-xs mt-0.5">Initialize a new laptop registry row</Text>
          </View>
        </View>

        <View className="bg-[#111A2E] border border-slate-800 rounded-3xl p-5 mb-4">
          <Text className="text-gray-400 text-xs font-black tracking-widest uppercase mb-2 px-1">
            Search Student Owner
          </Text>

          {fetchingUsers ? (
            <ActivityIndicator size="small" color="#3B82F6" className="py-2" />
          ) : !selectedStudent ? (
            <View>
              <View className="bg-[#0B1220] rounded-xl border border-slate-800 flex-row items-center px-3 mb-1">
                <Ionicons name="search-outline" size={18} color="#475569" />
                <TextInput
                  value={searchQuery}
                  onChangeText={handleSearchTextChange}
                  placeholder="Type student name, username, or ID..."
                  placeholderTextColor="#475569"
                  autoCapitalize="none"
                  className="flex-1 text-white p-3 font-medium text-sm text-left"
                />
              </View>

              {filteredUsers.length > 0 && (
                <View className="bg-[#0B1220] rounded-xl border border-slate-800 mt-2 max-h-[160px] overflow-hidden">
                  <ScrollView nestedScrollEnabled keyboardShouldPersistTaps="handled">
                    {filteredUsers.map((item) => (
                      <TouchableOpacity
                        key={item.id}
                        onPress={() => setSelectedStudent(item)}
                        className="p-3 border-b border-slate-900 flex-row justify-between items-center active:bg-slate-800"
                      >
                        <View>
                          <Text className="text-white font-bold text-sm">{item.first_name} {item.last_name}</Text>
                          <Text className="text-slate-400 text-xs font-mono">@{item.username}</Text>
                        </View>
                        <Text className="text-slate-500 text-xs font-mono">{item.student_id || "No ID"}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>
          ) : (
            <View className="bg-[#0B1220] p-4 rounded-xl border border-emerald-500/20 flex-row justify-between items-center">
              <View className="flex-row items-center">
                <Ionicons name="checkmark-circle" size={24} color="#10B981" />
                <View className="ml-3">
                  <Text className="text-white font-bold text-base">{selectedStudent.first_name} {selectedStudent.last_name}</Text>
                  <Text className="text-slate-400 text-xs font-mono">@{selectedStudent.username} • ID: {selectedStudent.student_id || "N/A"}</Text>
                </View>
              </View>
              <TouchableOpacity 
                onPress={() => { setSelectedStudent(null); setSearchQuery(""); }}
                className="bg-slate-800 p-2 rounded-lg"
              >
                <Text className="text-red-400 font-bold text-xs">Clear</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View className="bg-[#111A2E] border border-slate-800 rounded-3xl p-5 mb-5 space-y-5">
          
          <View>
            <Text className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2 px-1">
              Hardware Brand Manufacturer
            </Text>
            <View className="flex-row flex-wrap gap-2 mb-4">
              {(["HP", "DELL", "LENOVO", "APPLE", "OTHER"] as const).map((b) => (
                <TouchableOpacity
                  key={b}
                  onPress={() => setBrand(b)}
                  className={`px-4 py-2 rounded-xl border ${
                    brand === b ? "bg-blue-600 border-blue-500" : "bg-[#0B1220] border-slate-800"
                  }`}
                >
                  <Text className="text-white font-bold text-xs">{b}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View>
            <Text className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2 px-1">
              Serial Number
            </Text>
            <View className="bg-[#0B1220] rounded-xl border border-slate-800 flex-row items-center px-3">
              <TextInput
                value={serialNumber}
                onChangeText={setSerialNumber}
                placeholder="Enter hardware serial number..."
                placeholderTextColor="#475569"
                autoCapitalize="characters"
                className="flex-1 text-white p-3 font-medium text-sm text-left"
              />
            </View>
          </View>

          <TouchableOpacity
            onPress={handleRegister}
            disabled={loading}
            className="bg-blue-600 p-4 rounded-xl items-center justify-center mt-4 active:bg-blue-700"
          >
            {loading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text className="text-white font-bold text-base">Register Laptop</Text>
            )}
          </TouchableOpacity>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
