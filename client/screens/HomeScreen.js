import * as React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function HomeScreen() {
  const navigation = useNavigation();
  function onPressHandle_navTieBreaker() {
    navigation.navigate("Tie Breaker");
  }
  function onPressHandle_navActivities() {
    navigation.navigate("Activities");
  }
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Home</Text>
      <TouchableOpacity onPress={onPressHandle_navTieBreaker}>
        <Text>Go to tie breaker Screen</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onPressHandle_navActivities}>
        <Text>Go to activities Screen</Text>
      </TouchableOpacity>
    </View>
  );
}
