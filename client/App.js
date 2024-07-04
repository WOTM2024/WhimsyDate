// App.js
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import WelcomeScreen from "./screens/WelcomeScreen";
import HomeScreen from "./screens/HomeScreen";
import TieBreakerScreen from "./screens/TieBreakerScreen";
import GameRoomScreen from "./screens/GameRoomScreen";
import LoginScreen from "./screens/LoginScreen";
import ActivitiesScreen from "./screens/ActivitiesScreen";
import TestScreen from "./screens/TestScreen";
import { GestureHandlerRootView } from "react-native-gesture-handler";
const Stack = createNativeStackNavigator();

// https://tailwindcss.com/docs/customizing-colors#default-color-palette

export default function App() {
  return (
    <GestureHandlerRootView>
      <NavigationContainer>
        <Stack.Navigator>
          {/* <Stack.Screen name="Test" component={TestScreen} /> */}
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Activities" component={ActivitiesScreen} />
          <Stack.Screen name="Tie Breaker" component={TieBreakerScreen} />
          <Stack.Screen name="Game Room" component={GameRoomScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
