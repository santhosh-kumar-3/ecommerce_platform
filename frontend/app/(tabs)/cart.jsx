import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCartItems,
  updateCartItem,
  removeCartItem,
} from "../../redux/cartSlice";
import { SafeAreaView } from "react-native-safe-area-context";
import { AntDesign } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import CartItem from "../../componets/CartItem";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function CartScreen() {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((state) => state.cart);

  useFocusEffect(
    React.useCallback(() => {
      const loadCart = async () => {
        const token = await AsyncStorage.getItem("userToken");
        if (token) {
          dispatch(fetchCartItems());
        }
      };
      loadCart();
    }, [dispatch])
  );

  const handleQuantityChange = (productId, change) => {
    const item = items.find((i) => i.product._id === productId);
    const newQty = item.quantity + change;
    if (newQty < 1) return;

    dispatch(updateCartItem({ productId, quantity: newQty }))
      .unwrap()
      .then(() => {
        Toast.show({ type: "success", text1: "Cart updated" });
      })
      .catch((err) => {
        Toast.show({
          type: "error",
          text1: "Update failed",
          text2: err.message,
        });
      });
  };

  const totalAmount = items.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  const handleRemoveItem = async (productId) => {
    const result = await dispatch(removeCartItem(productId));
    if (removeCartItem.fulfilled.match(result)) {
      Toast.show({
        type: "success",
        text1: "Removed from cart",
      });
    } else {
      Toast.show({
        type: "error",
        text1: "Failed to remove",
      });
    }
  };

  const renderItem = ({ item }) => (
    <CartItem
      item={item}
      onQtyChange={handleQuantityChange}
      onRemove={handleRemoveItem}
    />
  );

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#2a9d8f" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-100 px-4 py-2">
      <Text className="text-2xl font-outfit-medium my-5">Your Cart</Text>
      <FlatList
        data={items}
        keyExtractor={(item) => item.product._id}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text className="text-center text-lg mt-20 text-gray-500">
            Your cart is empty 🛒
          </Text>
        }
      />
      {items.length > 0 && (
        <View className="p-4 bg-white border-t border-gray-300 shadow mt-2 rounded-xl">
          <Text className="text-xl font-bold text-gray-800 mb-2">
            Total: ₹{totalAmount}
          </Text>
          <TouchableOpacity className="bg-[#2a9d8f] py-3 rounded-xl">
            <Text className="text-center text-white font-semibold text-lg">
              Proceed to Checkout
            </Text>
          </TouchableOpacity>
        </View>
      )}
      <Toast />
    </SafeAreaView>
  );
}
