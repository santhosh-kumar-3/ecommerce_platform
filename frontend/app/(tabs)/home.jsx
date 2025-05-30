import {
  View,
  Text,
  TextInput,
  ScrollView,
  Image,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import api from "../../api/apiConfig";
import useAuthRedirect from "../../hooks/useAuthRedirect";
import { useRouter } from "expo-router";
import Swiper from "react-native-swiper";

const bannerImages = [
  require("../../assets/images/banner1.jpg"),
  require("../../assets/images/banner2.png"),
];

export default function Home() {
  useAuthRedirect();
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [flashSaleProducts, setFlashSaleProducts] = useState([]);

  useEffect(() => {
    const fetchCategoriesAndProducts = async () => {
      try {
        const res = await api.get("/categories");
        setCategories(res.data);

        if (res.data.length > 0) {
          const categoryId = res.data[0]._id;
          const productRes = await api.get(`/products?category=${categoryId}`);
          setFlashSaleProducts(productRes.data.slice(0, 4));
        }
      } catch (err) {
        console.error("Failed to load data:", err.message);
      }
    };

    fetchCategoriesAndProducts();
  }, []);

  return (
    <>
      <StatusBar backgroundColor="#cceee7" barStyle="dark-content" />

      <SafeAreaView className="flex-1 bg-[#cceee7]">
        {/* Search bar */}
        <View className="px-4 py-3">
          <TouchableOpacity
            onPress={() => router.push("/search")}
            className="flex-row items-center bg-white rounded-xl px-4 py-4 shadow"
          >
            <Text className="text-[#999] text-lg font-[outfit]">
              Search Products...
            </Text>
          </TouchableOpacity>
        </View>

        {/* Scrollable content */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 0 }}
          className="flex-grow"
        >
          {/* Category section */}
          <View className="bg-white mt-3 py-5 px-2">
            <Text className="pb-6 pl-2 text-xl">Top Categories for you</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 8 }}
            >
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat._id}
                  className="items-center mr-6"
                  onPress={() => router.push(`/category/${cat._id}`)}
                >
                  <Image
                    source={{ uri: cat.image }}
                    className="w-16 h-16 rounded-full mb-1"
                    resizeMode="cover"
                  />
                  <Text className="text-base font-[outfit] text-center">
                    {cat.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Slide Banner Section */}
          <View className="mt-4 px-2">
            <View className="h-60 rounded-lg overflow-hidden">
              <Swiper
                autoplay
                showsPagination
                dotColor="#ccc"
                activeDotColor="#2a9d8f"
                autoplayTimeout={4}
                paginationStyle={{ bottom: 10 }}
              >
                {bannerImages.map((img, index) => (
                  <Image
                    key={index}
                    source={img}
                    className="w-full h-full"
                    resizeMode="cover"
                  />
                ))}
              </Swiper>
            </View>
          </View>

          {/* Flash Sale Section */}
          <View className="mt-6 bg-white py-5 px-4">
            <Text className="text-xl font-semibold mb-6">🔥 Flash Sale</Text>
            <View className="flex-row flex-wrap justify-between">
              {flashSaleProducts.map((product) => {
                const discount = Math.round(
                  ((product.makingPrice - product.price) /
                    product.makingPrice) *
                    100
                );

                return (
                  <TouchableOpacity
                    key={product._id}
                    onPress={() => router.push(`/product/${product._id}`)}
                    className="w-[48%] bg-white rounded-2xl mb-5 shadow-md p-3"
                    activeOpacity={0.8}
                  >
                    <View className="relative">
                      <Image
                        source={{ uri: product.mainImage }}
                        className="w-full h-40 rounded-xl"
                        resizeMode="cover"
                      />
                      {/* Discount Badge */}
                      {discount > 0 && (
                        <View className="absolute top-2 left-2 bg-[#e63946] px-2 py-1 rounded-md shadow">
                          <Text className="text-white font-semibold text-xs">
                            {discount}% OFF
                          </Text>
                        </View>
                      )}
                    </View>

                    <Text
                      className="text-base font-semibold text-gray-900 mt-3"
                      numberOfLines={2}
                    >
                      {product.name}
                    </Text>

                    <View className="flex-row items-center mt-2">
                      <Text className="text-[#e63946] font-bold text-lg">
                        ₹{product.price}
                      </Text>
                      <Text className="text-gray-400 line-through text-sm ml-3">
                        ₹{product.makingPrice}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}
