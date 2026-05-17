import { View, Text, Image, ScrollView, TouchableOpacity, Animated, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef } from "react";

function PressableCard({ children }: { children: React.ReactNode }) {
  const scaleValue = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleValue, { toValue: 0.98, useNativeDriver: true, tension: 100, friction: 10 }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, { toValue: 1, useNativeDriver: true, tension: 100, friction: 10 }).start();
  };

  return (
    <Pressable onPressIn={handlePressIn} onPressOut={handlePressOut}>
      <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
        {children}
      </Animated.View>
    </Pressable>
  );
}

export default function Home() {
  const router = useRouter();

  const fadeHeader = useRef(new Animated.Value(0)).current;
  const slideHeader = useRef(new Animated.Value(15)).current;
  const fadeCards = useRef(new Animated.Value(0)).current;
  const slideCards = useRef(new Animated.Value(25)).current;
  const pulseValue = useRef(new Animated.Value(1)).current;

  const textOpacity = useRef(new Animated.Value(0)).current;
  const textTranslateY = useRef(new Animated.Value(8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeHeader, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(slideHeader, { toValue: 0, duration: 600, useNativeDriver: true }),
    ]).start(() => {
      Animated.parallel([
        Animated.timing(fadeCards, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.timing(slideCards, { toValue: 0, duration: 600, useNativeDriver: true }),
      ]).start();
    });

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseValue, { toValue: 1.06, duration: 1200, useNativeDriver: true }),
        Animated.timing(pulseValue, { toValue: 1, duration: 1200, useNativeDriver: true }),
      ])
    ).start();

    const createTimedMessageLoop = () => {
      Animated.sequence([
        Animated.parallel([
          Animated.timing(textOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
          Animated.timing(textTranslateY, { toValue: 0, duration: 500, useNativeDriver: true }),
        ]),
        Animated.delay(4000),
        Animated.parallel([
          Animated.timing(textOpacity, { toValue: 0, duration: 500, useNativeDriver: true }),
          Animated.timing(textTranslateY, { toValue: -8, duration: 500, useNativeDriver: true }),
        ]),
        Animated.timing(textTranslateY, { toValue: 8, duration: 0, useNativeDriver: true }),
        Animated.delay(4000),
      ]).start(() => createTimedMessageLoop());
    };

    createTimedMessageLoop();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-[#0B1220]">
      <ScrollView className="px-5 pt-6" showsVerticalScrollIndicator={false}>

        <Animated.View 
          style={{ opacity: fadeHeader, transform: [{ translateY: slideHeader }] }}
          className="mb-6 items-center border-b border-slate-800 pb-5"
        >
          <Animated.View 
            style={{ transform: [{ scale: pulseValue }] }}
            className="bg-blue-500/10 p-3 rounded-full mb-3 border border-blue-500/20"
          >
            <Ionicons name="shield-checkmark" size={32} color="#3B82F6" />
          </Animated.View>
          
          <Text className="text-white text-2xl font-extrabold tracking-tight text-center">
            UEAB Laptop Security
          </Text>
          <Text className="text-slate-400 mt-1.5 text-xs font-semibold tracking-wider uppercase">
            Secure • Smart • Real-Time Tracking
          </Text>
        </Animated.View>

        <Animated.View style={{ opacity: fadeCards, transform: [{ translateY: slideCards }] }}>
          
          <Text className="text-slate-400 text-xs font-black tracking-widest uppercase mb-4 px-1">
            System Core Operations
          </Text>

          <PressableCard>
            <View className="mb-4 bg-[#111A2E] border border-slate-800/80 p-4 rounded-2xl shadow-xl">
              <View className="flex-row items-center mb-3">
                <Ionicons name="qr-code-outline" size={18} color="#3B82F6" style={{ marginRight: 8 }} />
                <Text className="text-white font-bold text-base">
                  Scan Laptop QR Code
                </Text>
              </View>
              <Image
                source={require("../assets/images/phoneScanning.png")}
                className="w-full h-32 rounded-xl bg-[#0B1220]/50"
                resizeMode="contain"
              />
              <Text className="text-gray-400 mt-3 text-sm leading-relaxed">
                Use your device camera to read encrypted asset labels and verify physical entry or exit logs in under a second.
              </Text>
            </View>
          </PressableCard>

          <PressableCard>
            <View className="mb-4 bg-[#111A2E] border border-slate-800/80 p-4 rounded-2xl shadow-xl">
              <View className="flex-row items-center mb-3">
                <Ionicons name="person-search-outline" size={18} color="#10B981" style={{ marginRight: 8 }} />
                <Text className="text-white font-bold text-base">
                  Audit via Student Username
                </Text>
              </View>
              
              <View className="w-full h-32 rounded-xl bg-[#0B1220]/60 items-center justify-center border border-slate-800 flex-row px-6">
                <Ionicons name="finger-print-outline" size={36} color="#10B981" style={{ marginRight: 16 }} />
                <View className="flex-1">
                  <View className="h-7 bg-[#111A2E] rounded-lg border border-slate-700/60 justify-center px-3 mb-1.5">
                    <Text className="text-slate-500 font-mono text-[10px]">Enter username...</Text>
                  </View>
                  
                  <View className="h-5 bg-emerald-600/20 rounded border border-emerald-500/30 justify-center items-center overflow-hidden">
                    <Animated.View style={{ opacity: textOpacity, transform: [{ translateY: textTranslateY }] }}>
                      <Text className="text-emerald-400 font-bold text-[9px] uppercase tracking-wider text-center">
                        Instant Audit Verification
                      </Text>
                    </Animated.View>
                  </View>
                </View>
              </View>

              <Text className="text-gray-400 mt-3 text-sm leading-relaxed">
                No dynamic QR code available? Security staff can manually enter a student or officer username to clear check-in/out statuses instantly.
              </Text>
            </View>
          </PressableCard>

          <PressableCard>
            <View className="mb-6 bg-[#111A2E] border border-slate-800/80 p-4 rounded-2xl shadow-xl">
              <View className="flex-row items-center mb-3">
                <Ionicons name="library-outline" size={18} color="#EAB308" style={{ marginRight: 8 }} />
                <Text className="text-white font-bold text-base">
                  Tracked Library Inventory
                </Text>
              </View>
              <Image
                source={require("../assets/images/stdlaptop.jpg")}
                className="w-full h-32 rounded-xl"
                resizeMode="cover"
              />
              <Text className="text-gray-400 mt-3 text-sm leading-relaxed">
                Actively monitor hardware parameters inside open study terminals to protect shared student computing resources.
              </Text>
            </View>
          </PressableCard>

          <TouchableOpacity
            onPress={() => router.push("/(auth)/login")}
            className="bg-blue-500 p-4 rounded-xl flex-row items-center justify-center mb-8 active:opacity-90 shadow-lg shadow-blue-500/20"
          >
            <Text className="text-white text-center font-bold text-base mr-2">
              Access Portal Gateway
            </Text>
            <Ionicons name="arrow-forward" size={18} color="white" />
          </TouchableOpacity>

        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}
