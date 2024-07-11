import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { GameEngine } from "react-native-game-engine";
import entities from "../components/flappybird/entities";
import Physics from "../components/flappybird/physics";
import Background from "../components/flappybird/FlappyGameBackground";

export default function FlappyBirdScreen() {
  const [running, setRunning] = useState(false);
  const [gameEngine, setGameEngine] = useState(null);
  const [currentPoints, setCurrentPoints] = useState(0);
  const [gameOverHandled, setGameOverHandled] = useState(false);

  useEffect(() => {
    setRunning(false);
  }, []);

  return (
    <Background>
      <View style={{ flex: 1 }}>
        <Text style={{ textAlign: "center", fontSize: 40, fontWeight: "bold", margin: 20 }}>{currentPoints}</Text>
        <GameEngine
          ref={(ref) => {
            setGameEngine(ref);
          }}
          systems={[Physics]}
          entities={entities()}
          running={running}
          onEvent={(e) => {
            if (gameOverHandled) return;

            switch (e.type) {
              case "game_over":
                setRunning(false);
                gameEngine.stop();
                // console.log("Score: " + currentPoints);
                setGameOverHandled(true);
                break;
              case "new_point":
                setCurrentPoints(currentPoints + 1);
                break;
            }
          }}
          style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
        ></GameEngine>

        {!running ? (
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <TouchableOpacity
              style={{ backgroundColor: "black", paddingHorizontal: 30, paddingVertical: 10 }}
              onPress={() => {
                setCurrentPoints(0);
                setRunning(true);
                setGameOverHandled(false);
                gameEngine.swap(entities());
              }}
            >
              <Text style={{ fontWeight: "bold", color: "white", fontSize: 30 }}>START GAME</Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </View>
    </Background>
  );
}
