import * as React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function WelcomeScreen() {
  const navigation = useNavigation();
  function onPressHandle_navHome() {
    navigation.navigate("Home");
  }
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Welcome</Text>
      <TouchableOpacity onPress={onPressHandle_navHome}>
        <Text>Go to home screen</Text>
      </TouchableOpacity>
    </View>
  );
}
