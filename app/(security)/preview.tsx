import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { confirmTransaction } from "@/services/securityService";
import { useState } from "react";

export default function Preview() {
  const router = useRouter();
  const { data } = useLocalSearchParams();
  const [submitting, setSubmitting] = useState(false);

  const parsed = JSON.parse(data as string);

  const laptop = parsed.laptop;
  const owner = parsed.owner;
  const holder = parsed.current_holder;

  const isInside = laptop.is_inside_library;
  const action = isInside ? "OUT" : "IN";

  const handleConfirm = async () => {
    if (submitting) return;
    setSubmitting(true);
    
    try {
      await confirmTransaction({
        laptop_id: laptop.id,
        action
      });
      
      router.replace("/(security)");
    } catch (err) {
      console.log("CONFIRMATION ERROR:", err);
      alert("Failed to save transaction to database.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#0B1220] px-5 pt-6">

      <Text className="text-white text-2xl font-bold mb-4">
        Preview Transaction
      </Text>

      <View className="bg-[#111A2E] p-5 rounded-2xl border border-slate-800">

        <Text className="text-white font-bold text-lg">
          {laptop.brand || "Unknown Device"}
        </Text>

        <Text className="text-gray-400 font-mono text-sm mt-1">
          Serial: {laptop.serial_number}
        </Text>

        <View className="mt-5 border-t border-slate-800 pt-4">
          <Text className="text-[#3B82F6] text-xs font-bold uppercase tracking-wider">Registered Owner</Text>
          <Text className="text-white font-semibold text-base mt-0.5">
            {owner?.name || "N/A"}
          </Text>
          <Text className="text-gray-400 text-xs font-mono">ID: {owner?.student_id || "N/A"}</Text>
        </View>

        <View className="mt-4 border-t border-slate-800 pt-4">
          <Text className="text-purple-400 text-xs font-bold uppercase tracking-wider">Current Carrier</Text>
          <Text className="text-white font-semibold text-base mt-0.5">
            {holder?.name || "N/A"}
          </Text>
          <Text className="text-gray-400 text-xs font-mono">ID: {holder?.student_id || "N/A"}</Text>
        </View>

        <View className={`mt-5 p-4 rounded-xl border ${isInside ? 'bg-amber-950/40 border-amber-500/20' : 'bg-emerald-950/40 border-emerald-500/20'}`}>
          <Text className={`font-bold text-center tracking-wide ${isInside ? 'text-amber-400' : 'text-emerald-400'}`}>
            PROPOSED ACTION: {action === "IN" ? "CHECK IN (ENTRY)" : "CHECK OUT (EXIT)"}
          </Text>
        </View>

      </View>

      <TouchableOpacity
        onPress={handleConfirm}
        disabled={submitting}
        className="bg-emerald-600 p-4 rounded-xl mt-6 shadow-md"
      >
        <Text className="text-white text-center font-bold text-base">
          {submitting ? "Saving Log..." : "Confirm Transaction"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.replace("/(security)")}
        className="bg-slate-800 p-4 rounded-xl mt-3 border border-slate-700"
      >
        <Text className="text-gray-300 text-center font-bold">
          Cancel Operation
        </Text>
      </TouchableOpacity>

    </SafeAreaView>
  );
}
