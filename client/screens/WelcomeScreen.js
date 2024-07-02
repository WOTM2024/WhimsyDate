import * as React from "react";
import { Text, View, TouchableOpacity, SafeAreaView, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";

// ICONS
import { ChevronLeftIcon, ChevronRightIcon } from "react-native-heroicons/outline";
// https://heroicons.com/outline
// https://unpkg.com/browse/@heroicons/vue@2.1.4/24/outline/
// https://tailwindcss.com/docs

export default function WelcomeScreen() {
  const navigation = useNavigation();
  const tempUser = "user";

  function onPressHandle_navHome() {
    navigation.navigate("Home");
  }
  return (
    <SafeAreaView className="flex-1 items-center ">
      <View className="m-10" />
      <View>
        <Text className="text-center text-7xl">Welcome</Text>
        <Text className="text-center text-7xl">{tempUser}!</Text>
        <View className="m-2" />
        <Text className="text-center text-3xl">Choose an activity category</Text>
      </View>
      <View className="m-2" />
      <View className="flex-row items-center">
        <ChevronLeftIcon size={40} color="#1E1E1E" />
        <Image source={{ uri: "https://picsum.photos/300" }} className="w-72 h-72 rounded-md" />
        <ChevronRightIcon size={40} color="#1E1E1E" />
      </View>
      <View>
        <Text className="text-2xl">Eat Out/In</Text>
      </View>

      <View className="m-10" />
      <View>
        <TouchableOpacity onPress={onPressHandle_navHome} className="border">
          <Text>Go to home screen</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
