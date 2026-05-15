import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  ScrollView,
} from "react-native";

import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";

import {
  getProfile,
  updateProfile,
} from "../../../services/profileService";

import { SERVER_URL } from "../../../services/api";
import { router } from "expo-router";

export default function Profile() {
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [user, setUser] = useState<any>(null);

  const [formData, setFormData] = useState({
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    student_id: "",
    phone_number: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);

      const res = await getProfile();
      console.log("PROFILE DATA:", res);

      const data = res?.user ?? res;

      setUser(data);

      setFormData({
        username: data?.username ?? "",
        first_name: data?.first_name ?? "",
        last_name: data?.last_name ?? "",
        email: data?.email ?? "",
        student_id:
          data?.student_id && data.student_id !== "null"
            ? String(data.student_id)
            : "",
        phone_number: data?.phone_number ?? "",
      });
    } catch (error) {
      console.log("PROFILE ERROR:", error);
      Toast.show({
        type: "error",
        text1: "Failed to load profile",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleUpdate = async () => {
    try {
      await updateProfile(formData);

      Toast.show({
        type: "success",
        text1: "Profile Updated",
      });

      setEditing(false);
      fetchProfile();
    } catch (error) {
      console.log("UPDATE ERROR:", error);

      Toast.show({
        type: "error",
        text1: "Update Failed",
      });
    }
  };

  const getProfilePhoto = () => {
    if (!user?.profile_photo) return null;

    if (
      user.profile_photo.startsWith("http")
    ) {
      return user.profile_photo;
    }

    return `${SERVER_URL}${user.profile_photo}`;
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
      <ScrollView className="px-5 pt-6">

        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-white text-3xl font-bold">
            My Profile
          </Text>

          {!editing && (
            <TouchableOpacity onPress={() => setEditing(true)}>
              <Ionicons name="create-outline" size={28} color="white" />
            </TouchableOpacity>
          )}
        </View>

        {!editing ? (
          <View className="bg-[#111A2E] rounded-3xl p-6">

            {getProfilePhoto() ? (
              <Image
                source={{ uri: getProfilePhoto()! }}
                className="w-32 h-32 rounded-full border-4 border-blue-500 self-center mb-6"
              />
            ) : (
              <View className="w-32 h-32 rounded-full bg-gray-700 self-center mb-6 items-center justify-center">
                <Ionicons name="person" size={40} color="#ccc" />
              </View>
            )}

            <ProfileField label="Username" value={user?.username} />
            <ProfileField label="First Name" value={user?.first_name} />
            <ProfileField label="Last Name" value={user?.last_name} />
            <ProfileField label="Email" value={user?.email} />
            <ProfileField
              label="Student ID"
              value={user?.student_id && user.student_id !== "null" ? user.student_id : "Not Assigned"}
            />
            <ProfileField label="Phone" value={user?.phone_number} />
            <ProfileField label="Role" value={user?.role} />
          </View>
        ) : (
          <View className="bg-[#111A2E] rounded-3xl p-6">

            <InputField label="Username" value={formData.username} onChangeText={(t) => handleChange("username", t)} />
            <InputField label="First Name" value={formData.first_name} onChangeText={(t) => handleChange("first_name", t)} />
            <InputField label="Last Name" value={formData.last_name} onChangeText={(t) => handleChange("last_name", t)} />
            <InputField label="Email" value={formData.email} onChangeText={(t) => handleChange("email", t)} />
            <InputField label="Student ID" value={formData.student_id} onChangeText={(t) => handleChange("student_id", t)} />
            <InputField label="Phone Number" value={formData.phone_number} onChangeText={(t) => handleChange("phone_number", t)} />

            <View className="flex-row gap-3 mt-5">
              <TouchableOpacity
                className="flex-1 bg-red-500 p-4 rounded-2xl"
                onPress={() => setEditing(false)}
              >
                <Text className="text-white text-center font-bold">Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-1 bg-blue-500 p-4 rounded-2xl"
                onPress={handleUpdate}
              >
                <Text className="text-white text-center font-bold">Save</Text>
              </TouchableOpacity>
            </View>

          </View>
        )}
        <TouchableOpacity
        onPress={() => router.push("/(student)")}
        className="flex-row items-center justify-center bg-blue-500 p-4 rounded-2xl mt-6 mb-10"
      >
        <Ionicons name="home-outline" size={20} color="white" />

        <Text className="text-white font-bold ml-2">
          Back to Dashboard
        </Text>
      </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

function ProfileField({ label, value }: any) {
  return (
    <View className="mb-4 border-b border-gray-700 pb-2">
      <Text className="text-gray-400">{label}</Text>
      <Text className="text-white text-base mt-1">
        {value || "Not Set"}
      </Text>
    </View>
  );
}

function InputField({ label, value, onChangeText }: any) {
  return (
    <View className="mb-4">
      <Text className="text-gray-400 mb-1">{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        className="bg-[#0B1220] text-white p-3 rounded-xl"
        placeholder={label}
        placeholderTextColor="#666"
      />
    </View>
  );
}