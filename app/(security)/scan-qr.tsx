import { View, Text, TouchableOpacity, Platform, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { scanQR } from "@/services/securityService";
import { Ionicons } from "@expo/vector-icons";

export default function ScanScreen() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
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

  const isWeb = Platform.OS === "web";

  if (!isWeb && !permission) return <View className="flex-1 bg-[#0B1220]" />;

  if (!isWeb && !permission.granted) {
    return (
      <SafeAreaView className="flex-1 bg-[#0B1220] justify-center items-center px-6">
        <Ionicons name="camera-outline" size={64} color="#EF4444" />
        <Text className="text-white text-xl font-bold text-center mt-4 mb-2">
          Camera Access Required
        </Text>
        <Text className="text-gray-400 text-sm text-center mb-6">
          UEAB Library security needs camera authorization to audit incoming student laptop devices.
        </Text>
        <TouchableOpacity
          onPress={requestPermission}
          className="bg-blue-600 px-8 py-4 rounded-xl shadow-md w-full max-w-xs"
        >
          <Text className="text-white text-center font-bold text-base">Grant Camera Access</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const handleBarcodeScanned = async ({ data }: any) => {
    if (scanned || loading) return;

    if (!data || data.trim() === "" || data.includes("scan_qr") || data === "null") {
      return;
    }

    try {
      JSON.parse(data);
    } catch (e) {
      return;
    }

    setScanned(true);
    setLoading(true);
    setToastMessage(null); 

    try {
      const res = await scanQR(data);

      router.push({
        pathname: "/(security)/preview",
        params: { data: JSON.stringify(res.data) }
      });

    } catch (err) {
      setToastMessage("⚠️ Access Denied: Laptop record not found in Baraton Database registry.");
      setScanned(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      
      <View className="absolute top-12 left-5 z-10 flex-row items-center">
        <TouchableOpacity 
          onPress={() => router.replace("/(security)")} 
          className="bg-[#111A2E]/90 p-3 rounded-full border border-slate-800"
        >
          <Ionicons name="close-outline" size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-white font-bold ml-4 text-lg shadow-sm">Library Gate Scanner</Text>
      </View>

      {toastMessage && (
        <View className="absolute top-28 left-5 right-5 z-50 bg-red-950/95 border border-red-500/40 p-4 rounded-2xl flex-row items-center shadow-2xl animate-fade-in">
          <Ionicons name="alert-circle-outline" size={24} color="#EF4444" />
          <Text className="text-red-200 font-semibold ml-3 flex-1 text-xs leading-normal">
            {toastMessage}
          </Text>
        </View>
      )}

      <CameraView
        style={{ flex: 1 }}
        onBarcodeScanned={handleBarcodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
      />

      <View className="absolute bottom-10 w-full items-center px-6 space-y-4">
        
        {loading ? (
          <View className="bg-[#111A2E]/95 border border-blue-500/30 px-6 py-4 rounded-2xl flex-row items-center shadow-2xl w-full max-w-sm justify-center">
            <ActivityIndicator size="small" color="#3B82F6" />
            <Text className="text-white font-semibold ml-3 text-sm">Validating Security Tokens...</Text>
          </View>
        ) : (
          <View className="w-full max-w-sm space-y-3 items-center">
            
            <View className="bg-slate-900/90 border border-slate-800 px-5 py-3 rounded-full shadow-xl w-full">
              <Text className="text-gray-300 font-medium text-xs text-center tracking-wide">
                {isWeb ? "📷 Webcam active. Align student QR badge." : "📱 Mobile lens active. Align badge inside frame."}
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => router.replace("/(security)")}
              activeOpacity={0.8}
              className="bg-red-600/90 border border-red-500/20 py-3.5 rounded-2xl w-full shadow-lg flex-row justify-center items-center backdrop-blur-md"
            >
              <Ionicons name="chevron-back-outline" size={18} color="white" />
              <Text className="text-white font-bold text-sm ml-2 tracking-wide uppercase">
                Cancel & Go Back
              </Text>
            </TouchableOpacity>

          </View>
        )}
      </View>

    </SafeAreaView>
  );
}
