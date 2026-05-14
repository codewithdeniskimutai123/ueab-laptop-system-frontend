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
} from "../../services/profileService";

import {
  SERVER_URL,
} from "../../services/api";

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

      console.log("PROFILE DATA FETCHED:", res);

      const data = res?.user ? res.user : res;
      setUser(data);

      // FIXED: Safeguard student_id parsing against literal string "null" or null values
      setFormData({
        username: String(data?.username || ""),
        first_name: String(data?.first_name || ""),
        last_name: String(data?.last_name || ""),
        email: String(data?.email || ""),
        student_id: data?.student_id && String(data.student_id) !== "null" ? String(data.student_id) : "",
        phone_number: String(data?.phone_number || ""),
      });
    } catch (error) {
      console.log("Profile component fetch error:", error);
      Toast.show({
        type: "error",
        text1: "Failed to load profile",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleUpdate = async () => {
    try {
      // Create copy of state values to sanitize
      const payload: any = { ...formData };

      // FIXED: Strip student_id out entirely for admins or if it is empty to stop Django 400 validation error
      if (user?.role !== "student" || !payload.student_id.trim()) {
        delete payload.student_id;
      }

      await updateProfile(payload);
      
      Toast.show({
        type: "success",
        text1: "Profile Updated",
      });
      setEditing(false);
      fetchProfile();
    } catch (error: any) {
      console.log("Profile component update error details:", error);
      
      const backendErrorMsg = typeof error === "object" ? Object.values(error)[0] : "Update Failed";
      
      Toast.show({
        type: "error",
        text1: "Update Failed",
        text2: Array.isArray(backendErrorMsg) ? backendErrorMsg[0] : String(backendErrorMsg),
      });
    }
  };

  const getProfilePhotoUri = () => {
    if (!user?.profile_photo) return null;
    if (user.profile_photo.startsWith("http://") || user.profile_photo.startsWith("https://")) {
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

        {/* HEADER */}
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
          <View className="bg-[#111A2E] rounded-3xl p-6 mb-12">

            {getProfilePhotoUri() ? (
              <View className="items-center mb-6">
                <Image
                  source={{ uri: getProfilePhotoUri()! }}
                  className="w-32 h-32 rounded-full border-4 border-blue-500"
                />
              </View>
            ) : (
              <View className="items-center mb-6">
                <View className="w-32 h-32 rounded-full bg-gray-700 items-center justify-center border-4 border-gray-600">
                  <Ionicons name="person" size={48} color="#94A3B8" />
                </View>
              </View>
            )}

            <ProfileField label="Username" value={user?.username} />
            <ProfileField label="First Name" value={user?.first_name} />
            <ProfileField label="Last Name" value={user?.last_name} />
            <ProfileField label="Email" value={user?.email} />
            {/* FIXED: Conditionally displays field fallback layout cleanly */}
            <ProfileField label="Student ID" value={user?.student_id && String(user.student_id) !== "null" ? user.student_id : "Not Applicable"} />
            <ProfileField label="Phone Number" value={user?.phone_number} />
            <ProfileField label="Role" value={user?.role} />
          </View>
        ) : (
          <View className="bg-[#111A2E] rounded-3xl p-6 mb-12">
            
            <InputField
              label="Username"
              value={formData.username}
              onChangeText={(t) => handleChange("username", t)}
            />

            <InputField
              label="First Name"
              value={formData.first_name}
              onChangeText={(t) => handleChange("first_name", t)}
            />

            <InputField
              label="Last Name"
              value={formData.last_name}
              onChangeText={(t) => handleChange("last_name", t)}
            />

            <InputField
              label="Email"
              value={formData.email}
              onChangeText={(t) => handleChange("email", t)}
            />

            {/* FIXED: Hide or disable student ID input entirely if user is an admin */}
            {user?.role === "student" && (
              <InputField
                label="Student ID"
                value={formData.student_id}
                onChangeText={(t) => handleChange("student_id", t)}
              />
            )}

            <InputField
              label="Phone Number"
              value={formData.phone_number}
              onChangeText={(t) => handleChange("phone_number", t)}
            />

            <View className="flex-row gap-3 mt-5">
              <TouchableOpacity
                className="flex-1 bg-red-500 p-4 rounded-2xl"
                onPress={() => setEditing(false)}
              >
                <Text className="text-center text-white font-bold">Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-1 bg-blue-500 p-4 rounded-2xl"
                onPress={handleUpdate}
              >
                <Text className="text-center text-white font-bold">Save</Text>
              </TouchableOpacity>
            </View>

          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function ProfileField({ label, value }: { label: string; value: string }) {
  return (
    <View className="mb-5 border-b border-gray-800 pb-2">
      <Text className="text-gray-400 text-sm">{label}</Text>
      <Text className="text-white text-base font-medium mt-1">
        {value || "Not Set"}
      </Text>
    </View>
  );
}

function InputField({ label, value, onChangeText }: { label: string; value: string; onChangeText: (t: string) => void }) {
  return (
    <View className="mb-4">
      <Text className="text-gray-400 text-sm mb-1">{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={`Enter ${label}`}
        placeholderTextColor="#666"
        className="bg-[#0B1220] text-white p-3 rounded-xl border border-gray-800"
      />
    </View>
  );
}
