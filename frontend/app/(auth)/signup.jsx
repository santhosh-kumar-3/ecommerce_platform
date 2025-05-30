import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { signupUser } from "../../redux/authSlice";
import { useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import Toast from "react-native-toast-message";

export default function Signup() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignup = () => {
    if (!name || !email || !password || !confirmPassword) {
      Toast.show({ type: "error", text1: "Please fill all fields" });
      return;
    }

    if (password !== confirmPassword) {
      Toast.show({ type: "error", text1: "Passwords do not match" });
      return;
    }

    dispatch(signupUser({ name, email, password })).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        Toast.show({
          type: "success",
          text1: "Signup successful",
          text2: "Check your email for the OTP",
        });

        setTimeout(() => {
          router.push({ pathname: "/verifyOtp", params: { email } });
        }, 1500); 
      } else {
        Toast.show({
          type: "error",
          text1: "Signup failed",
          text2: res.payload || "Something went wrong",
        });
      }
    });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white"
    >
      <View className="flex-1 justify-center px-6">
        {/* Lottie Animation */}
        <LottieView
          source={require("../../assets/lotties/register.json")}
          autoPlay
          loop
          style={{
            height: 230,
            width: 270,
            alignSelf: "center",
            marginBottom: 20,
            backgroundColor: "transparent",
          }}
          resizeMode="cover"
        />

        {/* Title */}
        <Text className="text-[38px] font-outfit-medium text-start mb-1">
          Sign Up
        </Text>
        <Text className="text-gray-500 font-outfit-medium text-start text-xl mb-5">
          Create your account
        </Text>

        {/* Input Fields */}
        <TextInput
          placeholder="Name"
          className="border border-gray-300 rounded-xl px-4 py-4 mb-3 placeholder:font-outfit text-lg"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          placeholder="Email"
          className="border border-gray-300 rounded-xl px-4 py-4 mb-3 placeholder:font-outfit text-lg"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          placeholder="Password"
          className="border border-gray-300 rounded-xl px-4 py-4 mb-3 placeholder:font-outfit text-lg"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TextInput
          placeholder="Confirm Password"
          className="border border-gray-300 rounded-xl px-4 py-4 mb-3 placeholder:font-outfit text-lg"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />

        {/* Sign Up Button */}
        <TouchableOpacity
          onPress={handleSignup}
          className={`bg-blue-600 rounded-xl py-4 items-center justify-center mt-4 ${
            loading ? "opacity-70" : ""
          }`}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white text-xl font-outfit-medium font-semibold">
              Sign Up
            </Text>
          )}
        </TouchableOpacity>

        {/* Login Link */}
        <TouchableOpacity
          onPress={() => router.push("/login")}
          className="mt-6"
        >
          <Text className="text-center text-gray-500">
            Already have an account?{" "}
            <Text className="text-blue-600 font-semibold">Login</Text>
          </Text>
        </TouchableOpacity>
      </View>

      <Toast />
    </KeyboardAvoidingView>
  );
}
