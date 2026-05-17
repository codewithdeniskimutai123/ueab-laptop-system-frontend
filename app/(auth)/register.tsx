import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import Toast from "react-native-toast-message";

import { registerUser } from "../../services/authService";

export default function Register() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    first_name: "",
    last_name: "",
    student_id: "",
    email: "",
    phone_number: "",
    password: "",
    confirmPassword: "",
  });

  const [profilePhoto, setProfilePhoto] = useState<any>(null);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Toast.show({
        type: "error",
        text1: "Permission Required",
        text2: "Allow gallery access",
      });
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"], 
      quality: 1,
      allowsEditing: true,
      aspect: [1, 1],
    });

    if (!result.canceled) {
      setProfilePhoto(result.assets[0]);
    }
  };

  const validate = () => {
    setSubmitted(true);

    for (let key in formData) {
      if (!formData[key as keyof typeof formData]) {
        return false;
      }
    }

    if (!profilePhoto) {
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      Toast.show({
        type: "error",
        text1: "Passwords do not match",
      });
      return false;
    }

    return true;
  };

  const handleRegister = async () => {
    if (!validate()) {
      Toast.show({
        type: "error",
        text1: "Validation Error",
        text2: "Please fill all required fields",
      });
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();

      data.append("username", formData.username);
      data.append("first_name", formData.first_name);
      data.append("last_name", formData.last_name);
      data.append("student_id", formData.student_id);
      data.append("email", formData.email);
      data.append("phone_number", formData.phone_number);
      data.append("password", formData.password);

      if (profilePhoto.file) {
        data.append("profile_photo", profilePhoto.file);
      } else if (profilePhoto.uri.startsWith("blob:")) {
        const response = await fetch(profilePhoto.uri);
        const blob = await response.blob();
        data.append("profile_photo", blob, "profile.jpg");
      } else {
        data.append("profile_photo", {
          uri: profilePhoto.uri,
          type: profilePhoto.mimeType || "image/jpeg",
          name: "profile.jpg",
        } as any);
      }

      await registerUser(data);

      Toast.show({
        type: "success",
        text1: "Account Created",
      });

      router.push("/(auth)/login");
    } catch (err: any) {
      let errorTitle = "Registration Failed";
      let errorMessage = "Check your details and try again.";

      if (err && typeof err === "object") {
        if (err.username) {
          errorTitle = "Username Taken";
          errorMessage = Array.isArray(err.username) ? err.username[0] : err.username;
        } else if (err.email) {
          errorTitle = "Email Already Registered";
          errorMessage = Array.isArray(err.email) ? err.email[0] : err.email;
        } else if (err.student_id) {
          errorTitle = "Student ID Exists";
          errorMessage = Array.isArray(err.student_id) ? err.student_id[0] : err.student_id;
        } else if (err.detail) {
          errorMessage = err.detail;
        }
      }

      Toast.show({
        type: "error",
        text1: errorTitle,
        text2: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#0B1220]">
      <ScrollView className="px-6 pt-6 pb-12">
        <Text className="text-white text-2xl font-bold mb-2">
          Create Account
        </Text>

        <View className="mt-4">
          <Text className="text-gray-400">Username *</Text>
          <TextInput
            placeholder="Username"
            placeholderTextColor="#666"
            className="bg-[#111A2E] text-white p-3 rounded-lg mt-1"
            value={formData.username}
            onChangeText={(t) => handleChange("username", t)}
          />
          {submitted && !formData.username && (
            <Text className="text-red-500 text-xs mt-1">Field is a must, requires a value</Text>
          )}
        </View>

        <View className="mt-4">
          <Text className="text-gray-400">First Name *</Text>
          <TextInput
            placeholder="First Name"
            placeholderTextColor="#666"
            className="bg-[#111A2E] text-white p-3 rounded-lg mt-1"
            value={formData.first_name}
            onChangeText={(t) => handleChange("first_name", t)}
          />
          {submitted && !formData.first_name && (
            <Text className="text-red-500 text-xs mt-1">Field is a must, requires a value</Text>
          )}
        </View>

        <View className="mt-4">
          <Text className="text-gray-400">Last Name *</Text>
          <TextInput
            placeholder="Last Name"
            placeholderTextColor="#666"
            className="bg-[#111A2E] text-white p-3 rounded-lg mt-1"
            value={formData.last_name}
            onChangeText={(t) => handleChange("last_name", t)}
          />
          {submitted && !formData.last_name && (
            <Text className="text-red-500 text-xs mt-1">Field is a must, requires a value</Text>
          )}
        </View>

        <View className="mt-4">
          <Text className="text-gray-400">Student ID *</Text>
          <TextInput
            placeholder="Student ID"
            placeholderTextColor="#666"
            className="bg-[#111A2E] text-white p-3 rounded-lg mt-1"
            value={formData.student_id}
            onChangeText={(t) => handleChange("student_id", t)}
          />
          {submitted && !formData.student_id && (
            <Text className="text-red-500 text-xs mt-1">Field is a must, requires a value</Text>
          )}
        </View>

        <View className="mt-4">
          <Text className="text-gray-400">Email *</Text>
          <TextInput
            placeholder="Email"
            placeholderTextColor="#666"
            className="bg-[#111A2E] text-white p-3 rounded-lg mt-1"
            value={formData.email}
            onChangeText={(t) => handleChange("email", t)}
            keyboardType="email-address"
          />
          {submitted && !formData.email && (
            <Text className="text-red-500 text-xs mt-1">Field is a must, requires a value</Text>
          )}
        </View>

        <View className="mt-4">
          <Text className="text-gray-400">Phone Number *</Text>
          <TextInput
            placeholder="Phone Number"
            placeholderTextColor="#666"
            className="bg-[#111A2E] text-white p-3 rounded-lg mt-1"
            value={formData.phone_number}
            onChangeText={(t) => handleChange("phone_number", t)}
            keyboardType="phone-pad"
          />
          {submitted && !formData.phone_number && (
            <Text className="text-red-500 text-xs mt-1">Field is a must, requires a value</Text>
          )}
        </View>

        <View className="mt-4">
          <Text className="text-gray-400">Profile Photo *</Text>
          <TouchableOpacity onPress={pickImage} className="mt-2 items-start">
            {profilePhoto ? (
              <Image
                source={{ uri: profilePhoto.uri }}
                className="w-24 h-24 rounded-full border border-gray-600"
              />
            ) : (
              <View className="w-24 h-24 rounded-full bg-[#111A2E] items-center justify-center border border-dashed border-gray-600">
                <Text className="text-gray-400 text-xs">Select Photo</Text>
              </View>
            )}
          </TouchableOpacity>
          {submitted && !profilePhoto && (
            <Text className="text-red-500 text-xs mt-1">Field is a must, requires a value</Text>
          )}
        </View>

        <View className="mt-4">
          <Text className="text-gray-400">Password *</Text>
          <TextInput
            secureTextEntry={true}
            placeholder="Password"
            placeholderTextColor="#666"
            className="bg-[#111A2E] text-white p-3 rounded-lg mt-1"
            value={formData.password}
            onChangeText={(t) => handleChange("password", t)}
          />
          {submitted && !formData.password && (
            <Text className="text-red-500 text-xs mt-1">Field is a must, requires a value</Text>
          )}
        </View>

        <View className="mt-4">
          <Text className="text-gray-400">Confirm Password *</Text>
          <TextInput
            secureTextEntry={true}
            placeholder="Confirm Password"
            placeholderTextColor="#666"
            className="bg-[#111A2E] text-white p-3 rounded-lg mt-1"
            value={formData.confirmPassword}
            onChangeText={(t) => handleChange("confirmPassword", t)}
          />
          {submitted && !formData.confirmPassword && (
            <Text className="text-red-500 text-xs mt-1">Field is a must, requires a value</Text>
          )}
        </View>

        <TouchableOpacity
          onPress={handleRegister}
          className="bg-blue-500 p-4 rounded-xl mt-6"
        >
          <Text className="text-center text-white font-bold">
            {loading ? "Creating..." : "Register"}
          </Text>
        </TouchableOpacity>

        <View className="flex-row justify-center mt-6 mb-12">
          <Text className="text-gray-400">Already have an account? </Text>
          <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
            <Text className="text-blue-400 font-bold">Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
