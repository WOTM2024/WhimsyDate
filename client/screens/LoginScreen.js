import * as React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function LoginScreen() {
  const navigation = useNavigation();
  function onPressHandle_navWelcome() {
    navigation.replace("Welcome");
  }
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Login</Text>
      <TouchableOpacity onPress={onPressHandle_navWelcome}>
        <Text>Go to welcome screen</Text>
      </TouchableOpacity>
    </View>
  );
}
