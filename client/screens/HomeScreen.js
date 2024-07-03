// HomeScreen.js
import * as React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";

export default function HomeScreen() {
  const navigation = useNavigation();
  function onPressHandle_navTieBreaker() {
    navigation.navigate("Tie Breaker");
  }
  function onPressHandle_navActivities() {
    navigation.navigate("Activities");
  }
  return (
    <LinearGradient colors={["#B999FF", "#D9D9D9"]} style={{ flex: 1 }}>
      <View className="flex-1 items-center ">
        {/* <Text>Home</Text> */}
        <View className="m-5" />
        <Text className="text-3xl font-semibold">Swipe left/right to spin</Text>
        <View className="m-2" />
        <View className="border w-96 h-96"></View>
        <View className="m-2" />
        <View className="w-72">
          <TouchableOpacity className="border bg-slate-950 p-2 rounded-lg">
            <Text className="text-base text-center text-light_button_text font-semibold">Veto</Text>
          </TouchableOpacity>
          <View className="m-3" />
          <TouchableOpacity className="border bg-light_button_background p-2 rounded-lg">
            <Text className="text-base text-center text-light_button_text font-semibold">Select</Text>
          </TouchableOpacity>
        </View>

        {/* Below is temp content */}
        <View className="m-10" />
        <TouchableOpacity onPress={onPressHandle_navTieBreaker} className="border">
          <Text>Go to tie breaker Screen</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onPressHandle_navActivities} className="border">
          <Text>Go to activities Screen</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}
