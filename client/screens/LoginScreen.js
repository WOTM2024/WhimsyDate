import * as React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function LoginScreen() {
  const navigation = useNavigation();
  function onPressHandle_navWelcome() {
    navigation.replace("Welcome");
  }
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-5xl">Login</Text>
      <TouchableOpacity onPress={onPressHandle_navWelcome}>
        <Text className="text-base border-1">Go to welcome screen</Text>
      </TouchableOpacity>
    </View>
  );
}
