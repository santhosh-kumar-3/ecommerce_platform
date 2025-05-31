import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import api from "../../../api/apiConfig";
import { SafeAreaView } from "react-native-safe-area-context";
import Swiper from "react-native-swiper";
import { AntDesign } from "@expo/vector-icons";
import { useDispatch } from "react-redux";
import { addToCart, fetchCartItems } from "../../../redux/cartSlice";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ProductDetail() {
  const { id } = useLocalSearchParams();
  const dispatch = useDispatch();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addLoading, setAddLoading] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        console.error("Failed to load product:", err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#2a9d8f" />
      </View>
    );
  }

  const handleAddToCart = async () => {
    try {
      setAddLoading(true);

      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        Toast.show({
          type: "error",
          text1: "Please login to add items to cart",
        });
        router.push("/login");
        return;
      }

      const result = await dispatch(
        addToCart({ productId: product._id, quantity: 1 })
      );

      if (addToCart.fulfilled.match(result)) {
        Toast.show({
          type: "success",
          text1: "Added to cart successfully!",
        });
      } else {
        Toast.show({
          type: "error",
          text1: "Failed to add to cart",
          text2: result.payload?.message || "Try again later",
        });
      }
    } catch (err) {
      console.error("Add to cart error:", err.message);
      Toast.show({
        type: "error",
        text1: "Add to cart failed",
        text2: err.message || "Try again later",
      });
    } finally {
      setAddLoading(false);
    }
  };

  if (!product) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-lg text-gray-500">Product not found.</Text>
      </View>
    );
  }

  const discount = Math.round(
    ((product.makingPrice - product.price) / product.makingPrice) * 100
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Image */}
        <View className="h-[400px] relative bg-gray-100">
          <Swiper
            autoplay
            showsPagination
            dotColor="#ccc"
            activeDotColor="#2a9d8f"
          >
            {[product.mainImage, ...product.subImages].map((img, index) => (
              <Image
                key={index}
                source={{ uri: img }}
                className="w-full h-full"
                resizeMode="cover"
              />
            ))}
          </Swiper>

          {/* Back Icon */}
          <TouchableOpacity
            onPress={() => router.back()}
            className="absolute top-4 left-4 bg-white rounded-full p-2 shadow"
          >
            <AntDesign name="arrowleft" size={24} color="#333" />
          </TouchableOpacity>
        </View>

        {/* Product Details */}
        <View className="p-4">
          <Text className="text-3xl font-outfit-bold text-gray-800">
            {product.name}
          </Text>

          <Text className="text-lg font-outfit-medium text-gray-500 mt-1">
            Category: {product.category?.name}
          </Text>

          {discount > 0 && (
            <View className="mt-3 bg-[#e63946] w-20 px-3 py-2 rounded-md">
              <Text className="text-white text-sm font-semibold">
                {discount}% OFF
              </Text>
            </View>
          )}

          <Text className="text-black text-4xl font-bold mt-5">
            ₹{product.price}
          </Text>
          <View className="flex-row text-lg items-center mt-1">
            <Text className="text-base">MRP: </Text>
            <Text className="text-[#2a9d8f] line-through text-xl">
              ₹{product.makingPrice}
            </Text>
          </View>

          <Text className="text-base text-gray-700 mt-6 leading-relaxed">
            {product.description}
          </Text>
        </View>
      </ScrollView>

      {/* Bottom Buttons */}
      <View className="flex-row justify-between px-4 py-4 bg-white shadow border-t border-gray-200">
        <TouchableOpacity
          onPress={handleAddToCart}
          className="bg-yellow-500 px-6 py-3 rounded-xl flex-1 mr-2"
          disabled={addLoading}
        >
          {addLoading ? (
            <ActivityIndicator size="small" color="#000" />
          ) : (
            <Text className="text-center text-black font-bold text-base">
              Add to Cart
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity className="bg-[#2a9d8f] px-6 py-3 rounded-xl flex-1 ml-2">
          <Text className="text-center text-white font-bold text-base">
            Buy Now
          </Text>
        </TouchableOpacity>
      </View>
      <Toast />
    </SafeAreaView>
  );
}
