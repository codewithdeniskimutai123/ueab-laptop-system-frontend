import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";

import { loginUser } from "../../services/authService";
import { saveAuth } from "../../services/authStorage";

export default function Login() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      Toast.show({
        type: "error",
        text1: "Missing Details",
        text2: "Please fill in both fields.",
      });
      return;
    }

    setLoading(true);

    try {
      const res = await loginUser({
        username: username.trim(),
        password: password,
      });

      // save auth
      await saveAuth({
        access: res.access,
        refresh: res.refresh,
        role: res.role,
        username: res.username,
      });

      const userRole = (res.role || "").toLowerCase();

      console.log("ROLE DEBUG:", userRole);

      Toast.show({
        type: "success",
        text1: "Login Successful",
        text2: `Welcome back ${res.username}`,
      });

      // ROLE ROUTING
      if (userRole === "student") {
        router.replace("/(student)");
      } else if (userRole === "security") {
        router.replace("/(security)");
      } else if (userRole === "admin") {
        router.replace("/(admin)");
      } else {
        Toast.show({
          type: "error",
          text1: "Invalid Role",
          text2: userRole,
        });
      }

    } catch (err: any) {
      Toast.show({
        type: "error",
        text1: "Login Failed",
        text2:
          err?.detail ||
          err?.non_field_errors?.[0] ||
          "Invalid credentials",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-[#0B1220] px-6 justify-center">

      <Text className="text-white text-2xl font-bold mb-2">
        Welcome Back
      </Text>

      <Text className="text-gray-400 mb-8">
        Login to access the system
      </Text>

      <TextInput
        placeholder="Username"
        placeholderTextColor="#94A3B8"
        value={username}
        onChangeText={setUsername}
        className="bg-[#111A2E] text-white p-4 rounded-xl mb-4"
      />

      <TextInput
        placeholder="Password"
        placeholderTextColor="#94A3B8"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        className="bg-[#111A2E] text-white p-4 rounded-xl mb-6"
      />

      <TouchableOpacity
        onPress={handleLogin}
        disabled={loading}
        className="bg-blue-500 p-4 rounded-xl"
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white text-center font-bold">
            Login
          </Text>
        )}
      </TouchableOpacity>

    </View>
  );
}