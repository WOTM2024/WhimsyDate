// TieBreaker.js
import * as React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ChevronLeftIcon, ChevronRightIcon } from "react-native-heroicons/outline";

export default function TieBreakerScreen() {
  const navigation = useNavigation();
  function onPressHandle_navGameRoom() {
    navigation.navigate("Game Room");
  }
  return (
    <View className="flex-1 items-center justify-center">
      {/* <Text>Tie Breaker</Text> */}
      <View className="border w-96 h-3/4 relative">
        <Image source={{ uri: "https://picsum.photos/300" }} className="object-cover w-full h-full" />
        <View className="absolute left-0 top-1/2 transform -translate-y-1/2">
          <ChevronLeftIcon size={40} color="#1E1E1E" />
        </View>
        <View className="absolute right-0 top-1/2 transform -translate-y-1/2">
          <ChevronRightIcon size={40} color="#1E1E1E" />
        </View>
      </View>
      <View className="m-2" />
      <View>
        <TouchableOpacity onPress={onPressHandle_navGameRoom} className="border">
          <Text>Play Game</Text>
        </TouchableOpacity>
      </View>

      {/* Below is temp content */}
      <View className="m-5" />
      <TouchableOpacity onPress={onPressHandle_navGameRoom} className="border">
        <Text>Go to game room Screen</Text>
      </TouchableOpacity>
    </View>
  );
}
