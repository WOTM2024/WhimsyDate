import * as React from "react";
import { View, Text, TouchableOpacity, TextInput, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function LoginScreen() {
  const navigation = useNavigation();
  function onPressHandle_navWelcome() {
    navigation.navigate("Welcome");
  }
  return (
    <View className="flex-1 items-center ">
      {/* <Text className="text-5xl">Login</Text> */}
      <View className="m-6" />
      <Image source={{ uri: "https://picsum.photos/300" }} className="w-72 h-72 rounded-full" />
      <View className="m-3" />
      <View className="w-52">
        <TextInput placeholder="email" keyboardType="default" className="border m-2 p-1" />
        <TextInput placeholder="username" keyboardType="default" className="border m-2 p-1" />
        <TextInput placeholder="password" keyboardType="default" className="border m-2 p-1" />
      </View>
      <View className="m-3" />
      <View className="w-52">
        <TouchableOpacity className="border">
          <Text className="text-base text-center">Login</Text>
        </TouchableOpacity>
        <View className="m-1" />
        <TouchableOpacity className="border">
          <Text className="text-base text-center">Register</Text>
        </TouchableOpacity>
      </View>
      {/* Below is temp content */}
      <View className="m-10" />
      <TouchableOpacity onPress={onPressHandle_navWelcome} className="border">
        <Text className="text-base">welcome screen</Text>
      </TouchableOpacity>
    </View>
  );
}
