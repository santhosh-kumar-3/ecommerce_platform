import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/authSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

export default function Profile() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    await AsyncStorage.removeItem("userToken");
    await AsyncStorage.removeItem("userData");
    dispatch(logout());
    router.replace("/(auth)/login");
  };

  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    user?.name || user?.email
  )}&background=random&format=png`;

  return (
    <View className="flex-1 bg-white px-6 pt-20 justify-center">
      <View className="items-center">
        <Image
          source={{ uri: avatarUrl }}
          style={{
            width: 120,
            height: 120,
            borderRadius: 60,
            marginBottom: 24,
            borderWidth: 2,
            borderColor: "#4F46E5", // Indigo-600
          }}
          defaultSource={require("../../assets/images/react-logo.png")}
        />
        <Text className="text-2xl font-bold text-gray-900 mb-2">UserName : {user?.name}</Text>
        <Text className="text-gray-600 text-base mb-10">Email : {user?.email}</Text>
      </View>

      <TouchableOpacity
        onPress={handleLogout}
        className="bg-red-600 rounded-lg py-4"
        activeOpacity={0.8}
        style={{ shadowColor: "#4F46E5", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.4, shadowRadius: 4, elevation: 5 }}
      >
        <Text className="text-white text-center font-semibold text-lg">Logout</Text>
      </TouchableOpacity>
    </View>
  );
}
