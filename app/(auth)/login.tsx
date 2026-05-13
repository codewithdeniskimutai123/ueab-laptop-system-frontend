import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useState } from "react";

export default function Login() {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    console.log("User ID:", userId);
    console.log("Password:", password);
  };

  return (
    <View className="flex-1 bg-[#0B1220] px-6 justify-center">

      {/* TITLE */}
      <Text className="text-white text-2xl font-bold mb-2">
        Welcome Back
      </Text>

      <Text className="text-gray-400 mb-8">
        Login to access the laptop tracking system
      </Text>

      {/* USER ID INPUT */}
      <TextInput
        placeholder="User ID"
        placeholderTextColor="#94A3B8"
        value={userId}
        onChangeText={setUserId}
        className="bg-[#111A2E] text-white p-4 rounded-xl mb-4"
      />

      {/* PASSWORD INPUT */}
      <TextInput
        placeholder="Password"
        placeholderTextColor="#94A3B8"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        className="bg-[#111A2E] text-white p-4 rounded-xl mb-6"
      />

      {/* LOGIN BUTTON */}
      <TouchableOpacity
        onPress={handleLogin}
        className="bg-blue-500 p-4 rounded-xl"
      >
        <Text className="text-white text-center font-bold">
          Login
        </Text>
      </TouchableOpacity>

    </View>
  );
}