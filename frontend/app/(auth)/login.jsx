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
import { loginUser } from "../../redux/authSlice";
import { useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import Toast from "react-native-toast-message";

export default function Login() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { loading } = useSelector((state) => state.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (!email || !password) {
      Toast.show({ type: "error", text1: "Please fill all fields" });
      return;
    }

    dispatch(loginUser({ email, password })).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        Toast.show({ type: "success", text1: "Login successful!" });
        router.replace("/(tabs)/home");
      } else {
        Toast.show({
          type: "error",
          text1: "Login failed",
          text2: res.payload || "Invalid credentials",
        });
      }
    });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white"
    >
      <View className="flex-1 justify-center px-6 ">
        {/* Lottie Animation */}
        <LottieView
          source={require("../../assets/lotties/login.json")}
          autoPlay
          loop
          style={{
            height: 230,
            width: 230,
            alignSelf: "center",
            marginBottom: 20,
            backgroundColor: "transparent",
          }}
          resizeMode="cover"
        />

        {/* Title */}
        <Text className="text-[38px] font-outfit-medium text-start mb-1">Login</Text>
        <Text className="text-gray-500 font-outfit-medium text-start text-xl mb-5">
          Please sign in to continue
        </Text>

        {/* Inputs */}
        <TextInput
          placeholder="Username"
          className="border border-gray-300 rounded-xl px-4 py-4 mb-3 placeholder:font-outfit text-lg"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />
        <TextInput
          placeholder="Password"
          className="border border-gray-300 rounded-xl px-4 py-4 mb-3 placeholder:font-outfit text-lg"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        {/* Login Button */}
        <TouchableOpacity
          onPress={handleLogin}
          className={`bg-blue-600 rounded-xl py-4 items-center justify-center mt-6 ${
            loading ? "opacity-70" : ""
          }`}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white text-xl font-outfit-medium font-semibold">Sign In</Text>
          )}
        </TouchableOpacity>

        {/* Sign up Link */}
        <TouchableOpacity
          onPress={() => router.push("/(auth)/signup")}
          className="mt-6"
        >
          <Text className="text-center text-gray-500">
            Don’t have an account?{" "}
            <Text className="text-blue-600 font-semibold">Sign Up</Text>
          </Text>
        </TouchableOpacity>
      </View>

      <Toast />
    </KeyboardAvoidingView>
  );
}
