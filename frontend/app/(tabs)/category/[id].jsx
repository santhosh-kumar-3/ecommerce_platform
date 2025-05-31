import {
  View,
  Text,
  TextInput,
  ScrollView,
  Image,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch } from "react-redux";
import api from "../../../api/apiConfig";
import { addToCart } from "../../../redux/cartSlice";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function CategoryProducts() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const dispatch = useDispatch();
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingIds, setLoadingIds] = useState([]); // For loading per product

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get(`/products/category/${id}`);
        setProducts(res.data);
      } catch (err) {
        console.error("Failed to load products:", err.message);
      }
    };

    fetchProducts();
  }, [id]);

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Add to cart handler for each product
  const handleAddToCart = async (productId) => {
    try {
      // Show loading for this product
      setLoadingIds((prev) => [...prev, productId]);

      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        Toast.show({
          type: "error",
          text1: "Please login to add items to cart",
        });
        router.push("/login");
        return;
      }

      const result = await dispatch(addToCart({ productId, quantity: 1 }));

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
      setLoadingIds((prev) => prev.filter((id) => id !== productId));
    }
  };

  return (
    <>
      <StatusBar backgroundColor="#cceee7" barStyle="dark-content" />
      <View className="flex-row items-center p-4 bg-[#cceee7]">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text className="text-lg font-bold">Category</Text>
      </View>
      <SafeAreaView className="flex-1 bg-[#cceee7]">
        {/* Search bar */}
        <View className="px-4 py-3">
          <TextInput
            placeholder="Search in this category..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            className="bg-white rounded-xl px-4 py-3 text-lg"
          />
        </View>

        {/* Product list */}
        <ScrollView className="px-4">
          {filtered.map((product) => {
            const isLoading = loadingIds.includes(product._id);
            return (
              <View
                key={product._id}
                className="bg-white rounded-xl p-4 mb-4 flex-row items-center"
              >
                <TouchableOpacity
                  style={{ flex: 1, flexDirection: "row" }}
                  onPress={() => router.push(`/product/${product._id}`)}
                  activeOpacity={0.8}
                >
                  <Image
                    source={{ uri: product.mainImage }}
                    className="w-20 h-20 rounded-lg mr-4"
                  />
                  <View className="flex-1 justify-center">
                    <Text className="text-lg font-[outfit]">{product.name}</Text>
                    <Text className="text-sm text-gray-600">₹{product.price}</Text>
                  </View>
                </TouchableOpacity>

                {/* Add to Cart Button */}
                <TouchableOpacity
                  onPress={() => handleAddToCart(product._id)}
                  className="bg-yellow-500 px-4 py-2 rounded-md ml-4"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator size="small" color="#000" />
                  ) : (
                    <Text className="text-black font-bold">Add to Cart</Text>
                  )}
                </TouchableOpacity>
              </View>
            );
          })}
        </ScrollView>
      </SafeAreaView>
      <Toast />
    </>
  );
}
