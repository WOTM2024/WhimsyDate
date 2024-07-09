// TieBreaker.js
import * as React from "react";
import { View, Text, TouchableOpacity, Image, SafeAreaView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ChevronLeftIcon, ChevronRightIcon } from "react-native-heroicons/outline";
import { LinearGradient } from "expo-linear-gradient";
import flappydemoimage from "../assets/flappydemoimage.png";

export default function TieBreakerScreen() {
  const navigation = useNavigation();
  function onPressHandle_navGameRoom() {
    navigation.navigate("Game Room");
  }
  return (
    <LinearGradient colors={["#B999FF", "#D9D9D9"]} style={{ flex: 1 }}>
      <SafeAreaView className="flex-1 items-center justify-center">
        <View className="m-6" />
        {/* <Text>Tie Breaker</Text> */}
        <View className=" w-96 h-3/4 relative">
          <Image source={flappydemoimage} className="object-cover w-full h-full drop-shadow-2xl" />
          <TouchableOpacity className="absolute left-0 top-1/2 transform -translate-y-1/2 rounded-full bg-gray-800/30">
            <ChevronLeftIcon size={40} color="#1E1E1E" />
          </TouchableOpacity>
          <TouchableOpacity className="absolute right-0 top-1/2 transform -translate-y-1/2 rounded-full bg-gray-800/30">
            <ChevronRightIcon size={40} color="#1E1E1E" />
          </TouchableOpacity>
        </View>
        <View className="m-4" />
        <View>
          <TouchableOpacity
            onPress={onPressHandle_navGameRoom}
            className="border bg-light_button_background p-2 rounded-lg"
          >
            <Text className="text-base text-center text-light_button_text font-semibold">Play Game</Text>
          </TouchableOpacity>
        </View>

        {/* Below is temp content */}
        {/* <View className="m-5" />
        <TouchableOpacity onPress={onPressHandle_navGameRoom} className="border">
          <Text>Go to game room Screen</Text>
        </TouchableOpacity> */}
      </SafeAreaView>
    </LinearGradient>
  );
}

className = "rounded-full bg-gray-800/30";
