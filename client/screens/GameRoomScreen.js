// GameRoomScreen.js
import * as React from "react";
import { View, Text, TouchableOpacity, TextInput } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";

export default function GameRoomScreen() {
  const navigation = useNavigation();
  const roomCode = "0";
  const PlayerOne = { username: "test player" };
  const PlayerTwo = { username: "test player2" };

  // invite to send your partner your room/game invite.
  // pairing code is your partners unique id

  function onPressHandle_FlappyBird() {
    navigation.navigate("FlappyBird");
  }

  return (
    <LinearGradient colors={["#B999FF", "#D9D9D9"]} style={{ flex: 1 }}>
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        {/* <Text>Game Room</Text> */}
        <Text className="font-bold">Room Code: {roomCode}</Text>
        <View className="w-52">
          <TextInput
            placeholder="pairing code"
            keyboardType="default"
            className="border border-light_border m-2 p-2 rounded-md"
          />
          <View className="m-2"></View>
          <TouchableOpacity className="border w-32 mx-auto bg-light_button_background p-2 rounded-lg">
            <Text className="text-base text-center text-light_button_text font-semibold">Invite</Text>
          </TouchableOpacity>
          <View className="m-2"></View>
          <TouchableOpacity className="border bg-slate-950 p-2 rounded-lg" onPress={onPressHandle_FlappyBird}>
            <Text className="text-base text-center text-light_button_text font-semibold">Start Game</Text>
          </TouchableOpacity>
        </View>

        <View className="m-10" />
        <View className="w-40 h-25 p-2">
          <Text className="text-center w-fill h-fill p-2 font-bold">Connected Players</Text>
          <Text className="text-center border w-fill h-fill p-2 ">{PlayerOne.username}</Text>
          <Text className="text-center border w-fill h-fill p-2">{PlayerTwo.username}</Text>
        </View>
      </View>
    </LinearGradient>
  );
}
