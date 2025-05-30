import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform } from "react-native";
import { verifyOtp } from "../../api/authApi";
import { useRouter, useLocalSearchParams } from "expo-router";
import Toast from "react-native-toast-message";

export default function VerifyOtp() {
  const router = useRouter();
  const { email } = useLocalSearchParams();
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    if (!otp) {
      Toast.show({ type: "error", text1: "Please enter the OTP" });
      return;
    }

    setLoading(true);
    try {
      const res = await verifyOtp({ email, otp });
      Toast.show({ type: "success", text1: "OTP Verified", text2: res.data.message });

      setTimeout(() => {
        router.replace("/login");
      }, 1500);
    } catch (err) {
      Toast.show({
        type: "error",
        text1: "Verification Failed",
        text2: err.response?.data?.message || "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View className="flex-1 justify-center px-6">
        <Text className="text-[38px] font-outfit-medium mb-2">Enter OTP</Text>
        <Text className="text-gray-500 mb-6 text-base">Check your email for the 6-digit code</Text>

        <TextInput
          placeholder="Enter 6-digit OTP"
          className="border border-gray-300 rounded-xl px-4 py-4 mb-4 placeholder:font-outfit text-lg"
          keyboardType="numeric"
          value={otp}
          onChangeText={setOtp}
          maxLength={6}
        />

        <TouchableOpacity
          onPress={handleVerify}
          className={`bg-blue-600 rounded-xl py-4 items-center justify-center mt-2 ${loading ? "opacity-70" : ""}`}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white text-xl font-outfit-medium">Verify</Text>
          )}
        </TouchableOpacity>
      </View>

      <Toast />
    </KeyboardAvoidingView>
  );
}
