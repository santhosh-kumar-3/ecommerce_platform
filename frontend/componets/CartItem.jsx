import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";

export default function CartItem({ item, onQtyChange, onRemove }) {
  // console.log("Main Image URL:", item.product.mainImage);

  return (
    <View className="flex-row bg-white p-4 mb-3 rounded-2xl shadow-md">
      <Image
        source={{ uri: item.product.mainImage }}
        style={{ width: 98, height: 96 }} // w-28 = 112px, h-24 = 96px
        className="rounded-xl mr-4"
        resizeMode="cover"
      />
      <View className="flex-1 justify-between">
        <Text className="text-lg font-bold text-gray-900">
          {item.product.name}
        </Text>
        <Text className="text-base text-gray-500 mt-1">
          ₹{item.product.price} × {item.quantity}
        </Text>

        <View className="flex-row items-center justify-between mt-4">
          <View className="flex-row items-center space-x-6">
            <TouchableOpacity
              onPress={() => onQtyChange(item.product._id, -1)}
              className="bg-gray-200 rounded-full p-2 mr-2"
            >
              <AntDesign name="minus" size={13} color="#333" />
            </TouchableOpacity>
            <Text className="text-lg font-medium">{item.quantity}</Text>
            <TouchableOpacity
              onPress={() => onQtyChange(item.product._id, 1)}
              className="bg-gray-200 rounded-full p-2 ml-2"
            >
              <AntDesign name="plus" size={13} color="#333" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={() => onRemove(item.product._id)}
            className="flex-row items-center bg-red-500 px-3 py-2 rounded-md"
          >
            <MaterialIcons name="delete-outline" size={18} color="#fff" />
            <Text className="text-white text-sm ml-1">Remove</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
