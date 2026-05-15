import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from "react-native";

import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { getMyLaptop } from "../../services/studentService";
import { getAuth } from "@/services/authStorage";

export default function MyLaptop() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [laptop, setLaptop] = useState<any>(null);
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      setLoading(true);

      const [laptopData, auth] = await Promise.all([
        getMyLaptop().catch(() => null),
        getAuth(),
      ]);

      setLaptop(laptopData);
      setUserId(auth?.user?.id || auth?.id || null);
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Error loading data",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-[#0B1220] justify-center items-center">
        <ActivityIndicator size="large" color="#3B82F6" />
      </SafeAreaView>
    );
  }

  if (!laptop) {
    return (
      <SafeAreaView className="flex-1 bg-[#0B1220] justify-center items-center">
        <Text className="text-white">No laptop assigned</Text>
      </SafeAreaView>
    );
  }

  const isOwner = userId === laptop.owner_id;
  const isHolder = userId === laptop.current_holder_id;
  const isTransferred = laptop.owner_id !== laptop.current_holder_id;

  const getStatusMessage = () => {
    if (isOwner && isTransferred) {
      return {
        color: "bg-blue-900",
        text: "You transferred this laptop to another student",
        icon: "swap-horizontal",
      };
    }

    if (isHolder && !isOwner) {
      return {
        color: "bg-green-900",
        text: "You are currently holding this laptop",
        icon: "laptop",
      };
    }

    if (isOwner && !isTransferred) {
      return {
        color: "bg-green-900",
        text: "You own and currently hold this laptop",
        icon: "checkmark-circle",
      };
    }

    return {
      color: "bg-yellow-900",
      text: "You are not involved in this laptop",
      icon: "alert-circle",
    };
  };

  const status = getStatusMessage();

  return (
    <SafeAreaView className="flex-1 bg-[#0B1220]">
      <ScrollView className="px-5 pt-6">

        <View className="flex-row justify-between items-center mb-6">

          <Text className="text-white text-3xl font-bold">
            My Laptop
          </Text>

          <TouchableOpacity
            onPress={() => router.push("/(student)/qr-code")}
          >
            <Ionicons name="qr-code-outline" size={30} color="white" />
          </TouchableOpacity>

        </View>

        <View className="bg-[#111A2E] rounded-3xl p-6">

          <View className="items-center mb-6">
            <Text className="text-6xl">💻</Text>
          </View>

          <Field label="Brand" value={laptop.brand} />
          <Field label="Serial Number" value={laptop.serial_number} />

          <View className="mt-5 p-4 rounded-2xl bg-[#0B1220]">

            {isOwner && (
              <Text className="text-blue-400 font-bold mb-2">
                 OWNER VIEW
              </Text>
            )}

            {isHolder && !isOwner && (
              <Text className="text-green-400 font-bold mb-2">
                 HOLDER VIEW
              </Text>
            )}

            <Text className="text-white">
              Owner:{" "}
              <Text className="font-bold">{laptop.owner_name}</Text>
            </Text>

            <Text className="text-white mt-1">
              Current Holder:{" "}
              <Text className="font-bold">
                {laptop.current_holder_name}
              </Text>
            </Text>

          </View>

          <View className={`mt-5 p-3 rounded-xl ${status.color}`}>

            <View className="flex-row items-center">

              <Ionicons
                name={status.icon as any}
                size={18}
                color="white"
              />

              <Text className="text-white ml-2 font-bold">
                {status.text}
              </Text>

            </View>

          </View>

        </View>

        <TouchableOpacity
          onPress={() => router.push("/(student)")}
          className="bg-blue-500 p-4 rounded-2xl mt-6 mb-10"
        >
          <Text className="text-white text-center font-bold text-lg">
            Back to Dashboard
          </Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

function Field({ label, value }: any) {
  return (
    <View className="mb-4 border-b border-gray-700 pb-3">
      <Text className="text-gray-400 text-sm">{label}</Text>
      <Text className="text-white text-lg font-semibold mt-1">
        {value || "Not Set"}
      </Text>
    </View>
  );
}