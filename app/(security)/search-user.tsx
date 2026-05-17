import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { previewTransaction } from "@/services/securityService";
import { Ionicons } from "@expo/vector-icons";

export default function UsernameScreen() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
        router.replace("/(security)");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const handleSearch = async () => {
    if (!username.trim()) {
      setToastMessage("⚠️ Input Required: Please enter a student username first.");
      return;
    }

    setLoading(true);
    setToastMessage(null);
    try {
      const res = await previewTransaction({ username: username.trim() });

      router.push({
        pathname: "/(security)/preview",
        params: { data: JSON.stringify(res.data) }
      });

    } catch (err: any) {
      console.log("USERNAME LOOKUP ERROR:", err);
      setToastMessage("⚠️ Access Denied: Laptop record not found in Baraton Database registry.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#0B1220] px-5 pt-6">
      
      <View className="flex-row items-center mb-6">
        <TouchableOpacity onPress={() => router.replace("/(security)")} className="mr-3 p-1">
          <Ionicons name="arrow-back-outline" size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-2xl font-bold">
          Manual Search Lookup
        </Text>
      </View>

      {toastMessage && (
        <View className="bg-red-950/95 border border-red-500/40 p-4 rounded-2xl flex-row items-center shadow-2xl mb-6 animate-fade-in">
          <Ionicons name="alert-circle-outline" size={24} color="#EF4444" />
          <Text className="text-red-200 font-semibold ml-3 flex-1 text-xs leading-normal">
            {toastMessage}
          </Text>
        </View>
      )}

      <Text className="text-gray-400 text-sm mb-4">
        If a student badge's QR code is scratched or unreadable, enter their university account username manually below to pull up records.
      </Text>

      <View className="bg-[#111A2E] p-5 rounded-3xl border border-slate-800">
        <Text className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">
          Baraton Student Username
        </Text>
        
        <TextInput
          value={username}
          onChangeText={setUsername}
          placeholder="e.g. denis.kimutai"
          placeholderTextColor="#475569"
          autoCapitalize="none"
          autoCorrect={false}
          editable={!loading && !toastMessage}
          className="bg-[#0B1220] text-white p-4 rounded-xl border border-slate-800 text-base font-medium"
        />

        <TouchableOpacity
          onPress={handleSearch}
          disabled={loading || !!toastMessage}
          className={`p-4 rounded-xl mt-5 items-center flex-row justify-center ${loading ? 'bg-slate-800' : 'bg-blue-600'}`}
        >
          {loading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <>
              <Ionicons name="search-outline" size={20} color="white" />
              <Text className="text-white text-center font-bold text-base ml-2">
                Preview Profile
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
}
