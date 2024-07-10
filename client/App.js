// App.js
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Platform } from "react-native";
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
import { HomeIcon, UserIcon, TrophyIcon, RocketLaunchIcon } from "react-native-heroicons/solid";
import UserProfileScreen from "./screens/UserProfileScreen";
import FlappyBirdScreen from "./screens/FlappyBirdScreen";

import { UserProvider } from "./contexts/UserContext";

import Animated, { useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <GestureHandlerRootView>
      <UserProvider>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerTransparent: true,
            }}
          >
            {/* <Stack.Screen name="Test" component={TestScreen} /> */}
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Tabs" component={TabsNavigator} options={{ headerShown: false }} />
            <Stack.Screen name="Activities" component={ActivitiesScreen} />
            <Stack.Screen name="Inspiration" component={InspirationScreen} />
            <Stack.Screen name="Game Room" component={GameRoomScreen} />
            <Stack.Screen name="FlappyBird" component={FlappyBirdScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </UserProvider>
    </GestureHandlerRootView>
  );
}

function TabBarIcon({ route, focused, color, size }) {
  let IconComponent;
  if (route.name === "Welcome") {
    IconComponent = RocketLaunchIcon;
  } else if (route.name === "Home") {
    IconComponent = HomeIcon;
  } else if (route.name === "Tie Breaker") {
    IconComponent = TrophyIcon;
  } else if (route.name === "User Profile") {
    IconComponent = UserIcon;
  }

  const scale = useSharedValue(focused ? 1.1 : 1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: withSpring(scale.value) }],
    };
  });

  return (
    <Animated.View style={animatedStyle}>
      <IconComponent size={size} color={color} />
    </Animated.View>
  );
}

function TabsNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Welcome"
      screenOptions={({ route }) => ({
        tabBarIcon: (props) => <TabBarIcon {...props} route={route} />,
        tabBarActiveTintColor: "#4C25A2",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: {
          backgroundColor: "#ffffff",
          borderTopWidth: 0,
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "500",
        },
        tabBarIconStyle: {
          marginTop: -2,
        },
        tabBarItemStyle: {
          borderRadius: 10,
          margin: 5,
        },
        headerTransparent: true,
      })}
    >
      <Tab.Screen name="Welcome" component={WelcomeScreen} options={{ tabBarLabel: "Welcome", headerShown: false }} />
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: "Home", headerShown: false }} />
      {/* <Tab.Screen
        name="Tie Breaker"
        component={TieBreakerScreen}
        options={{ tabBarLabel: "Tie Breaker", headerShown: false }}
      /> */}
      {/* <Tab.Screen
        name="EmptyComponent"
        component={EmptyComponent}
        options={{}}
        listeners={({ navigation }) => ({
          tabPress: (event) => {
            event.preventDefault();
          },
        })}
      /> */}
      <Tab.Screen
        name="User Profile"
        component={UserProfileScreen}
        options={{ tabBarLabel: "User", headerShown: false }}
      />
    </Tab.Navigator>
  );
}

export function EmptyComponent() {
  return null;
}
