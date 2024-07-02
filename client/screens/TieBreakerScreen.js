import * as React from "react";
import { View, Text, TouchableOpacity, Button } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function TieBreakerScreen() {
  const navigation = useNavigation();
  function onPressHandle_navGameRoom() {
    navigation.navigate("Game Room");
  }
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Tie Breaker</Text>
      <TouchableOpacity onPress={onPressHandle_navGameRoom}>
        <Text>Go to game room Screen</Text>
      </TouchableOpacity>
    </View>
  );
}
