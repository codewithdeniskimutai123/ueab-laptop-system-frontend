import {
  View,
  Text,
  ActivityIndicator,
  Image,
  TouchableOpacity,
} from "react-native";
import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { getMyLaptop, downloadQr } from "../../services/studentService";
import API from "../../services/api";

export default function QrCode() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [laptop, setLaptop] = useState<any>(null);
  const [qrBase64, setQrBase64] = useState<string | null>(null);

  useEffect(() => {
    loadLaptopDataAndImage();
  }, []);

  const loadLaptopDataAndImage = async () => {
    try {
      setLoading(true);
      
      const data = await getMyLaptop();
      setLaptop(data);

      if (data?.id) {
        const response = await API.get(`laptops/download_qr/${data.id}/`, {
          responseType: "arraybuffer",
        });

        const base64Flag = "data:image/png;base64,";
        const imageStr = btoa(
          new Uint8Array(response.data).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            ""
          )
        );
        
        setQrBase64(base64Flag + imageStr);
      }
    } catch (err) {
      console.log("INITIAL DATA FETCH MAPPING ERROR:", err);
      Toast.show({
        type: "error",
        text1: "Failed to render system data views",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!laptop?.id) {
      Toast.show({
        type: "error",
        text1: "No active laptop found",
      });
      return;
    }

    try {
      setDownloading(true);
      await downloadQr(laptop.id);
      Toast.show({
        type: "success",
        text1: "Download complete!",
      });
    } catch (err) {
      Toast.show({
        type: "error",
        text1: "Download failed",
        text2: "Verify connection profiles.",
      });
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-[#0B1220] justify-center items-center">
        <ActivityIndicator size="large" color="#3B82F6" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#0B1220]">
      <View className="px-5 pt-6">
        
        <View className="flex-row items-center mb-6">
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={26} color="white" />
          </TouchableOpacity>
          <Text className="text-white text-2xl font-bold ml-3">
            My QR Code
          </Text>
        </View>

        <View className="bg-white p-6 rounded-2xl items-center shadow-md">
          {qrBase64 ? (
            <Image
              source={{ uri: qrBase64 }} 
              className="w-52 h-52"
              resizeMode="contain"
            />
          ) : (
            <View className="w-52 h-52 bg-slate-100 items-center justify-center rounded-xl">
              <ActivityIndicator size="small" color="#94A3B8" />
              <Text className="text-slate-400 text-xs mt-2 font-medium">Generating preview stream...</Text>
            </View>
          )}

          <Text className="text-slate-900 mt-4 font-bold text-base">
            Serial: {laptop?.serial_number || "Unknown"}
          </Text>
          <Text className="text-slate-500 text-sm mt-1">
            Brand: {laptop?.brand || "N/A"}
          </Text>
        </View>

        <TouchableOpacity
          onPress={handleDownload}
          disabled={downloading}
          className={`p-4 rounded-2xl mt-6 flex-row justify-center items-center ${
            downloading ? "bg-blue-400" : "bg-blue-500"
          }`}
        >
          {downloading ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <>
              <Ionicons name="download-outline" size={20} color="white" />
              <Text className="text-white font-bold ml-2">Save QR Code</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/(student)")}
          className="bg-slate-800 p-4 rounded-2xl mt-4 border border-slate-700"
        >
          <Text className="text-white text-center font-bold">
            Back to Dashboard
          </Text>
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  );
}
