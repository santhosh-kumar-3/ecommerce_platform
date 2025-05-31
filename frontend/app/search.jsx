import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import api from "../api/apiConfig";

export default function SearchScreen() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    try {
      const res = await api.get(`/products/search?query=${query}`);
      setResults(res.data);
    } catch (err) {
      console.error("Search error:", err.message);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white px-4 pt-4">
      <View className="flex-row items-center border border-gray-300 rounded-xl px-4 py-2 mb-4">
        <TextInput
          placeholder="Search for products"
          className="flex-1 text-base text-black font-[outfit]"
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={handleSearch}
          autoFocus
        />
      </View>

      {results.length === 0 ? (
        <Text className="text-center text-gray-500 font-[outfit]">
          No results yet
        </Text>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <TouchableOpacity
              className="flex-row items-center mb-4"
              onPress={() => router.push(`/product/${item._id}`)}
            >
              <Image
                source={{ uri: item.mainImage }}
                className="w-20 h-20 rounded-lg mr-4"
              />
              <View>
                <Text className="text-base font-[outfit-bold]">
                  {item.name}
                </Text>
                <Text className="text-sm text-gray-700">₹{item.price}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
}
