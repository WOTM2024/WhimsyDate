// GameRoomScreen.js
import * as React from "react";
import { View, Text, TouchableOpacity, TextInput } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function GameRoomScreen() {
  const navigation = useNavigation();
  const roomCode = "0";
  const PlayerOne = { username: "test player" };
  const PlayerTwo = { username: "test player2" };

  // invite to send your partner your room/game invite.
  // pairing code is your partners unique id

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      {/* <Text>Game Room</Text> */}
      <Text>Room Code: {roomCode}</Text>
      <View className="w-52">
        <TextInput placeholder="pairing code" keyboardType="default" className="border m-2 p-1" />
        <View className="m-2"></View>
        <TouchableOpacity className="border w-32 mx-auto">
          <Text className="text-base text-center">Invite</Text>
        </TouchableOpacity>
        <View className="m-2"></View>
        <TouchableOpacity className="border">
          <Text className="text-base text-center">Start Game</Text>
        </TouchableOpacity>
      </View>

      <View className="m-10" />
      <View className="border w-40 h-25 p-2">
        <Text className="text-center w-fill h-fill p-2">Connected Players</Text>
        <Text className="text-center border w-fill h-fill p-2">{PlayerOne.username}</Text>
        <Text className="text-center border w-fill h-fill p-2">{PlayerTwo.username}</Text>
      </View>
    </View>
  );
}
