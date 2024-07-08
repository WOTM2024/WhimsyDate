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
import InspirationScreen from "./screens/InspirationScreen";
import TestScreen from "./screens/TestScreen";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { HomeIcon } from "react-native-heroicons/solid";
import UserProfileScreen from "./screens/UserProfileScreen";
import FlappyBirdScreen from "./screens/FlappyBirdScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// https://tailwindcss.com/docs/customizing-colors#default-color-palette

export default function App() {
  return (
    <GestureHandlerRootView>
      <NavigationContainer>
        <Stack.Navigator>
          {/* <Stack.Screen name="Test" component={TestScreen} /> */}
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Tabs" component={TabsNavigator} options={{ headerShown: false }} />
          <Stack.Screen name="Activities" component={ActivitiesScreen} />
          <Stack.Screen name="Inspiration" component={InspirationScreen} />
          <Stack.Screen name="Game Room" component={GameRoomScreen} />
          <Stack.Screen name="FlappyBird" component={FlappyBirdScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

function TabsNavigator() {
  return (
    <Tab.Navigator initialRouteName="Welcome">
      <Tab.Screen name="Welcome" component={WelcomeScreen} />
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: "Home",
          tabBarIcon: () => <HomeIcon size={20} color="purple" />,
        }}
      />
      <Tab.Screen name="Tie Breaker" component={TieBreakerScreen} />
      <Tab.Screen name="User Profile" component={UserProfileScreen} />
    </Tab.Navigator>
  );
}
